// @ts-nocheck
"use client";
import { HtmlRequestTemplate } from "@/assets/template-request";
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
import { createClient } from "@/services/supabase";
import { cn } from "@/utils/cn";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { FileText, LoaderCircle } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HandleRoute } from "../../handle-route";
import { useRequests } from "../../contexts/resquests";
import type { RequestType, RequestTypeDetailed } from "@/types/request";
import { getSchools } from "../../actions";
import { useToast } from "@/components/ui/use-toast";

const generatePDFs = async (
  requests: RequestTypeDetailed[]
): Promise<Buffer> => {
  return await pdf(
    <HtmlRequestTemplate
			requests={requests}
    />
  )?.toBuffer();
};

export const HandleRequest = () => {
  const supabase = createClient();
  const { toast } = useToast();
  const { requests, cooperatives, cityHalls, setLoadingRequests, routes } =
    useRequests();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState<string | undefined>();
  const requestsErrorValidatorInputRef = useRef(null);

  useEffect(() => {
    if (requestsErrorValidatorInputRef.current) {
      const hasError = requests.some(
        (request) => request.status !== "success" || request.issue
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
		setLoading('Buscando escolas...');

    const schoolsIds = requests.map((request) => request.school.id);
    const schools = await getSchools(schoolsIds);
    if (!schools)
      return toast({
        variant: "destructive",
        title: "Erro ao gerar zip",
      });

		setLoading('Lendo dados...');

    const requestsByCooperative = cooperatives.reduce(
      (acc, cooperative) => {
				const requestsByCooperative: RequestTypeDetailed[] = [];
				for (const request of requests) {
					const foods = request.foods.filter(({ cooperativeId }) => Number(cooperativeId) === Number(cooperative.id));
					if (foods.length) {
						const cityHall = cityHalls.find(({ id }) => id === request.cityHallId);
						if (!cityHall) continue;
						const school = schools.find(
							({ id }) => Number(id) === Number(request.id)
						);
						if (!school) continue;

						requestsByCooperative.push({
							foods,
							cooperative: {
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
									.getPublicUrl(`${cityHall.id}/${cityHall.emblem}`).data.publicUrl,
								name: cityHall.name,
								phone: cityHall.phone,
							},
							date: date.toLocaleDateString("pt-BR", { dateStyle: "long" }),
							school,
							route: routes.findIndex(({ requestIds }) => requestIds.has(request.id)) + 1,
						})
					}
				}
				acc.push(requestsByCooperative);
        return acc;
      }, [] as RequestTypeDetailed[][]
    );

    const zip = new JSZip();
    let finished = 0;
		setLoading(`Montando PDFs ${finished}/${requestsByCooperative.length + 2}`);

    const pdfBuffers = await Promise.all(
    	requestsByCooperative.map(async (requests) => {
    		return {
    			name: requests[0].cooperative.name,
    			buffer: await generatePDFs(requests).finally(
    				() => {
    					finished++;
							setLoading(`Montando PDFs ${finished}/${requestsByCooperative.length + 2}`);
    				},
    			),
    		};
    	}),
    );

    let finishedZip = 0;
		setLoading("Gerando .zip");
		for (const pdfBuffer of pdfBuffers) {
      zip.file(
        `rota-${pdfBuffer.route} ${pdfBuffer.name}.pdf`,
        pdfBuffer.buffer
      );
      finishedZip++;
    }
    const zipContent = await zip.generateAsync({ type: "blob" });
    saveAs(zipContent, "romaneios.zip");
  };

  return requests.length ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.preventDefault();
          if (requestsErrorValidatorInputRef.current.checkValidity()) {
            setOpen(true);
          } else {
            requestsErrorValidatorInputRef.current.reportValidity();
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
          typeof percent === "number" && "pointer-events-none"
        )}
      >
        <Form
          insetChildren={false}
          onSubmitFinish={async () => {
            setLoadingRequests(true);
            await generateAndDownloadZip();
            setLoadingRequests(false);
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
                  disabled={(date) => date < new Date()}
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
            disabled={typeof percent === "number"}
            disabledByForm
            className="w-fit mx-auto"
          >
            {loading ? (
              <>
                {setLoading}
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

/*
<div className="z-[99999999999999] fixed w-screen h-screen top-0 left-0">
  <PDFViewer className="w-full h-full">
    <HtmlRequestTemplate
      cityHallEmblem={supabase.storage.from('cityhall').getPublicUrl(`${requests[0].cityHall.id}/${requests[0].cityHall?.emblem}`).data.publicUrl}
      cooperativeEmblem={supabase.storage.from('cityhall').getPublicUrl(`${requests[0].cityHall.id}/${requests[0].cityHall?.emblem}`).data.publicUrl}
      cooperativeName="{cooperative.name}"
      cooperativePhone="{cooperative.phone}"
      requestsFoods={requests[0].foods}
      cityHallCNPJ="{request.cityHall?.cnpj}"
      cityHallName="{request.cityHall?.name}"
      cityHallPhone="{request.cityHall?.phone}"
      cooperativeCNPJ="{cooperative.cnpj}"
      schoolName={requests[0].name}
      schoolNumber="{request.number}"
      schoolAddress="{request.address}"
      schoolPhone="{request.phone}"
      route={1}
      date="{date.toLocaleDateString('pt-BR', { dateStyle: 'long' })}"
    />
  </PDFViewer>
</div>
*/
