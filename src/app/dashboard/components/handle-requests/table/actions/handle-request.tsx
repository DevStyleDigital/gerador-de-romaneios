"use client";
import { PDFFoods } from "@/assets/template-foods";
import { PDFRequests } from "@/assets/template-request";
import { Form } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/services/supabase";
import type { RequestType, RequestTypeDetailed } from "@/types/request";
import { cn } from "@/utils/cn";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { FileText, LoaderCircle } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSchools, updateSchoolsComments } from "../../actions";
import { useRequests } from "../../contexts/resquests";
import { HandleRoute } from "../../handle-route";
import {
  LOCAL_STORAGE_REQUEST,
  saveToLocalStorage,
} from "../../utils/loacal-storage";

const generatePDFs = async (requests: RequestTypeDetailed[]) => {
  return await pdf(<PDFRequests requests={requests} />)?.toBuffer();
};
const generatePDFFoods = async (
  foods: {
    foods: RequestType["foods"];
    schools: {
      number?: number;
      total: number;
    }[];
  }[]
) => {
  return await pdf(<PDFFoods foods={foods} />)?.toBuffer();
};

async function arrayToCsv(data: any[]) {
  const csvRows = [];

  // Get the headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(";"));

  // Loop over the rows
  for (const row of data) {
    const values = headers.map((header) => {
      const escaped = `${row[header]}`.replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(";"));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  return blob;
}

export const HandleRequest = () => {
  const supabase = createClient();
  const { toast } = useToast();
  const {
    requests,
    cooperatives,
    cityHalls,
    setLoadingRequests,
    routes,
    setRequests,
    setRoutes,
    pricesByCooperatives,
  } = useRequests();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState<string | undefined>();
  const requestsErrorValidatorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (requestsErrorValidatorInputRef.current) {
      const hasError = requests.some(
        (request) => request.status !== "success" || request.issues.length
      );

      if (hasError) {
        requestsErrorValidatorInputRef.current.setCustomValidity(
          "Não pode haver erro nos pedidos!"
        );
      } else {
        requestsErrorValidatorInputRef.current.setCustomValidity("");
      }
    }
  }, [requests]);

  const generateAndDownloadZip = async () => {
    setLoading("Buscando escolas...");

    const schoolsIds = requests.map((request) => request.school.id);
    const schools = await getSchools(schoolsIds);
    if (!schools)
      return toast({
        variant: "destructive",
        title: "Erro ao gerar zip",
      });

    setLoading("Lendo dados...");

    const updates: any[] = [];

    const requestsByCooperatives = cooperatives
      .reduce((acc, cooperative) => {
        const requestsByCooperatives: RequestTypeDetailed[] = [];
        for (const request of requests) {
          const foods = request.foods.filter(
            ({ cooperativeId }) =>
              Number(cooperativeId) === Number(cooperative.id)
          );
          if (foods.length) {
            const cityHall = cityHalls.find(
              ({ id }) => id === request.cityHallId
            );
            if (!cityHall) continue;
            const school = schools.find(
              ({ id }) => Number(id) === Number(request.school.id)
            );
            if (!school) continue;

            if (school.comments?.content?.length) {
              const updateExists = updates.find(
                (update) => update.id === school.id
              );
              if (updateExists) {
                updateExists.comments.content =
                  updateExists.comments.content.filter((comment: any) => {
                    return !(
                      comment.type === "tag" &&
                      comment.attrs.id === `cooperative-${cooperative.id}`
                    );
                  });
              } else {
                const newComments = school.comments.content.filter(
                  (comment: any) => {
                    return !(
                      comment.type === "tag" &&
                      comment.attrs.id === `cooperative-${cooperative.id}`
                    );
                  }
                );
                updates.push({
                  id: school.id,
                  comments: {
                    type: "doc",
                    content: newComments,
                  },
                });
              }
            }

            requestsByCooperatives.push({
              foods,
              cooperative: {
                id: cooperative.id.toString(),
                emblem: supabase.storage
                  .from("cooperative")
                  .getPublicUrl(`${cooperative.id}/${cooperative.emblem}`).data
                  .publicUrl,
                cnpj: cooperative.cnpj,
                name: cooperative.name,
                phone: cooperative.phone,
              },
              cityHall: {
                cnpj: cityHall.cnpj,
                emblem: supabase.storage
                  .from("cityhall")
                  .getPublicUrl(`${cityHall.id}/${cityHall.emblem}`).data
                  .publicUrl,
                name: cityHall.name,
                phone: cityHall.phone,
              },
              date: date!.toLocaleDateString("pt-BR", { dateStyle: "long" }),
              school,
              totalWeight: request.totalWeight,
              route:
                routes.findIndex(({ requestIds }) =>
                  requestIds.has(request.id)
                ) + 1,
            });
          }
        }
        acc.push(
          requestsByCooperatives.sort(
            (a, b) => a.route - b.route + a.school.number - b.school.number
          )
        );
        return acc;
      }, [] as RequestTypeDetailed[][])
      .filter((r) => r.length);

    const zip = new JSZip();
    let finished = 0;
    setLoading(
      `Montando PDFs ${finished}/${requestsByCooperatives.length + 2}`
    );

    const totalWeights = structuredClone(requests).reduce(
      (acc, request) => {
        const cityHallFoods = cityHalls.find(
          ({ id }) => request.cityHallId === id
        )?.foods;

        for (let route = 0; route < routes.length; route++) {
          if (!acc[route])
            acc.push({
              foods: [],
              schools: [],
            });
          if (!routes[route].requestIds.has(request.id)) continue;
          acc[route].schools.push({
            number: request.school.number,
            total: request.totalWeight,
          })

          for (const food of request.foods) {
            const accFoodIndex = acc[route].foods.findIndex(
              (item) =>
                item.cityHallFoodId === food.cityHallFoodId &&
                item.name === food.name
            );

            const weight =
              cityHallFoods?.find(
                ({ id }) =>
                  food.cityHallFoodId === `${id}?${request.cityHallId}`
              )?.weight ||
              food.weight ||
              1;

            if (accFoodIndex === -1) {
              acc[route].foods.push({ ...food, weight: Number(weight) });
              continue;
            }

            if (acc[route].foods[accFoodIndex]!.quantity)
              acc[route].foods[accFoodIndex]!.quantity! += food.quantity || 1;
            else acc[route].foods[accFoodIndex]!.quantity = food.quantity || 1;

            acc[route].foods[accFoodIndex]!.weight! = Number(weight);
          }
        }

        return acc;
      },
      [] as {
        foods: RequestType["foods"];
        schools: {
          number?: number;
          total: number;
        }[];
      }[]
    );

    const pdfBuffers = await Promise.all(
      requestsByCooperatives
        .concat([{ name: "Pesos" }, { name: "Relatório" }] as any)
        .map(async (requestsByCooperative) => {
          if ((requestsByCooperative as any).name === "Pesos") {
            return {
              name: (requestsByCooperative as any).name,
              buffer: await generatePDFFoods(totalWeights).finally(() => {
                finished++;
                setLoading(
                  `Montando PDFs ${finished}/${
                    requestsByCooperatives.length + 2
                  }`
                );
              }),
            };
          }

          if ((requestsByCooperative as any).name === "Relatório") {
            return {
              name: (requestsByCooperative as any).name,
              extension: "csv",
              buffer: arrayToCsv(
                pricesByCooperatives.map((pbc) => ({
                  fornecedora: pbc.name,
                  "preco (R$)": (pbc.price / 100).toLocaleString("pt-BR"),
                  "peso (Kg)": pbc.weight.toFixed(2),
                }))
              ).finally(() => {
                finished++;
                setLoading(
                  `Montando PDFs ${finished}/${
                    requestsByCooperatives.length + 2
                  }`
                );
              }),
            };
          }

          return {
            name: requestsByCooperative[0].cooperative.name,
            buffer: await generatePDFs(requestsByCooperative).finally(() => {
              finished++;
              setLoading(
                `Montando PDFs ${finished}/${requestsByCooperatives.length + 2}`
              );
            }),
          };
        })
    );

    let finishedZip = 0;
    setLoading(`Gerando .zip ${finishedZip}/${pdfBuffers.length}`);
    for (const pdfBuffer of pdfBuffers) {
      zip.file(
        `${pdfBuffer.name}.${pdfBuffer.extension || "pdf"}`,
        pdfBuffer.buffer
      );
      finishedZip++;
      setLoading(`Gerando .zip ${finishedZip}/${pdfBuffers.length}`);
    }
    const zipContent = await zip.generateAsync({ type: "blob" });

    if (updates.length) {
      await updateSchoolsComments(updates);
    }
    saveAs(zipContent, "romaneios.zip");
  };

  return requests.length ? (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);

        if (open === false) {
          setLoading(undefined);
          setLoadingRequests(false);
        }
      }}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.preventDefault();
          if (requestsErrorValidatorInputRef.current?.checkValidity()) {
            setOpen(true);
          } else {
            requestsErrorValidatorInputRef.current?.reportValidity();
          }
        }}
        className="relative"
      >
        <input
          ref={requestsErrorValidatorInputRef}
          className="sr-only left-1/2 top-full"
        />
        <Button type="submit">
          Gerar Romaneios
          <FileText className="size-4 ml-4" />
        </Button>
      </form>
      <DialogContent
        className={cn(
          "2xl:max-w-screen-2xl max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto",
          loading && "pointer-events-none"
        )}
      >
        <Form
          insetChildren={false}
          onSubmitFinish={async () => {
            setLoadingRequests(true);
            await generateAndDownloadZip();
            setLoading(undefined);
            // setLoadingRequests(false);
            // setRequests([]);
            // setRoutes([
            //   {
            //     requestIds: new Set() as Set<string>,
            //     weight: 0,
            //   },
            // ]);
            // saveToLocalStorage(LOCAL_STORAGE_REQUEST, []);
            // setOpen(false);
          }}
          action={async () => {
            return { error: null };
          }}
          className="sr-only flex flex-col"
          id="handle-request"
        >
          <div className="grid gap-1">
            <p>Data de Entrega:</p>
            <Popover>
              <PopoverTrigger asChild className="relative">
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    date.toLocaleDateString("pt-BR", { dateStyle: "medium" })
                  ) : (
                    <span>Selecione a data de entrega</span>
                  )}
                  <input
                    form="handle-request"
                    type="date"
                    name="date"
                    id="date"
                    className="sr-only left-1/2 top-full"
                    required={!date}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  required
                  disabled={(date) =>
                    date < new Date(Date.now() - 24 * 60 * 60 * 1000)
                  } // now - 1 day
                  form="handle-request"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator />
          <div className="w-full overflow-y-auto max-h-[70dvh]">
            <h3 className="mx-auto text-center text-2xl">Geração de Rotas:</h3>
            <HandleRoute />
          </div>
          <Separator />

          <Button
            type="submit"
            form="handle-request"
            disabled={!!loading}
            disabledByForm
            className="w-fit mx-auto"
          >
            {loading ? (
              <>
                {loading}
                <LoaderCircle className="size-4 ml-4 animate-spin" />
              </>
            ) : (
              <>
                Gerar Romaneios
                <FileText className="size-4 ml-4" />
              </>
            )}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  ) : null;
};
