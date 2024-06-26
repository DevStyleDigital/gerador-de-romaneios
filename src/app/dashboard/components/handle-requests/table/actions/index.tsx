import { Button } from "@/components/ui/button";
import {
  saveToLocalStorage,
  LOCAL_STORAGE_REQUEST,
} from "../../utils/loacal-storage";
import { TrashIcon } from "lucide-react";
import { useRequests } from "../../contexts/resquests";
import { HandleRequest } from "./handle-request";

export const RequestActions = () => {
  const { setRequests, requests } = useRequests();

  return (
    <div className="flex gap-4">
      <HandleRequest />
      {!!requests.length && <Button
        variant="destructive"
        onClick={() => {
          saveToLocalStorage(LOCAL_STORAGE_REQUEST, []);
          setRequests([]);
        }}
      >
        Excluir pedidos <TrashIcon className="size-4 ml-4" />
      </Button>}
    </div>
  );
};
