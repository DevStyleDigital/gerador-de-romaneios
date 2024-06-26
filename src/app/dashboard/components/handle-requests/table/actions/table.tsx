import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { RequestType } from "@/types/request";
import { AlertTriangleIcon, Ellipsis } from "lucide-react";
import { useRequests } from "../../contexts/resquests";
import { Combobox } from "@/components/comboboxes";
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { Label } from "@/components/ui/label";
import { Foods } from "./foods";

const Form = ({ request, index }: { request: RequestType; index: number }) => {
  const { cityHalls, setRequests } = useRequests();
  const [currentRequest, setCurrentRequest] = React.useState(
    structuredClone(request)
  );
  const [cityHallId, setCityHallId] = React.useState<string | undefined>(
    currentRequest.cityHallId
  );

  function getSchools(chid: string | undefined) {
    return cityHalls.find((cityHall) => cityHall.id === chid)?.schools;
  }

  const [schools, setSchools] = React.useState(getSchools(cityHallId) || []);
  const [school, setSchool] = React.useState<string | undefined>(
    currentRequest.id
  );

  function handleRequestErrorName() {
    setCurrentRequest((prevRequest) => {
      const newRequest = { ...prevRequest }; // Clone the current state
      if (newRequest.status !== "error") newRequest.status = "warning";
      if (!newRequest.issues.includes("name")) newRequest.issues.push("name");
      return newRequest;
    });
  }

  function handleRequestSuccessName() {
    setCurrentRequest((prevRequest) => {
      const newRequest = { ...prevRequest }; // Clone the current state
      newRequest.issues = newRequest.issues.includes("name")
        ? newRequest.issues.filter((issue) => issue !== "name")
        : newRequest.issues;
      if (newRequest.issues.length === 0) newRequest.status = "success";
      return newRequest;
    });
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        setRequests((prev) => {
          if (
            currentRequest.foods.every(({ issue }) => issue === null) &&
            !currentRequest.issues.includes("name")
          ) {
            currentRequest.issues = [];
            currentRequest.status = 'success';
          }

          prev[index] = currentRequest;
          return [...prev];
        });
      }}
      className="flex flex-col w-full max-w-[calc(100vw-5rem)] max-h-full"
    >
      <DialogHeader>
        <DialogTitle>Editar Pedidos</DialogTitle>
        <DialogDescription>
          Altere as informações conforme o necessário
        </DialogDescription>
      </DialogHeader>
      <Separator className="mt-8" />
      <div className="w-full h-[70dvh] overflow-y-auto py-8 px-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <Label htmlFor="cityhall_id">Prefeitura:</Label>
          <Label htmlFor="school">Escola:</Label>
          <Combobox
            data={cityHalls}
            label="prefeitura"
            id="cityhall_id"
            setValue={(id) => {
              setCityHallId(id);
              setSchools(getSchools(id) || []);
              setSchool(undefined);
              handleRequestErrorName();
            }}
            value={cityHallId}
          />
          <Combobox
            data={schools}
            label="escola"
            id="school"
            setValue={(id) => {
              setSchool(id);
              const school = schools.find(
                (sch) => Number(sch.id) === Number(id)
              )!;

              if (school.csv_name !== currentRequest.school.default_csv_name) {
                handleRequestErrorName();
              } else handleRequestSuccessName();
            }}
            value={school}
          />
        </div>
        <div className="flex gap-4 mt-4 items-end">
          <div className="w-full">
            <Label htmlFor="csv_name">CSV Name:</Label>
            <div className="relative w-full">
              <Input
                type="text"
                name="csv_name"
                id="csv_name"
                readOnly
                value={request.school.csv_name}
                className={cn(
                  currentRequest.issues.includes("name") && "border-yellow-400"
                )}
              />
              <AlertTriangleIcon
                className={cn(
                  "size-4 absolute text-muted-foreground bg-background right-4 top-1/2 -translate-y-1/2",
                  currentRequest.issues.includes("name") && "text-yellow-400"
                )}
              />
            </div>
          </div>
          {currentRequest.issues.includes("name") && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRequestSuccessName}
              className="w-fit"
            >
              Liberar
            </Button>
          )}
        </div>
        <Foods request={currentRequest} setCurrentRequest={setCurrentRequest} />
      </div>
      <Separator className="mb-8" />
      <DialogFooter className="flex-row max-md:justify-center gap-4">
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
};

export const TableActions = ({
  request,
  index,
}: {
  request: RequestType;
  index: number;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="!p-1.5 h-fit w-fit">
          <Ellipsis className="size-4" />
          <span className="sr-only">Abrir informações do pedido</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-2xl w-[calc(100vw-2rem)] h-[calc(100dvh-4rem)]">
        <Form request={request} index={index} />
      </DialogContent>
    </Dialog>
  );
};
