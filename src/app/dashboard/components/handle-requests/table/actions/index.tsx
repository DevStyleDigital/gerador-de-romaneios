import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { PlusCircleIcon, TrashIcon } from "lucide-react";
import { useRequests } from "../../contexts/resquests";
import {
	LOCAL_STORAGE_REQUEST,
	saveToLocalStorage,
} from "../../utils/loacal-storage";
import { HandleRequest } from "./handle-request";
import { TableActions } from "./table";

export const RequestActions = () => {
	const { setRequests, requests } = useRequests();

	return (
		<div className="flex gap-4">
			<TableActions
				request={{
					cityHallId: "",
					csvIndex: undefined,
					foods: [],
					id: "",
					issues: [],
					school: {
						csv_name: "",
						default_csv_name: "",
						id: "",
						name: "",
						number: undefined,
					},
					status: "success",
					totalValue: 0,
					totalWeight: 0,
				}}
				index={requests.length}
			>
				<DialogTrigger asChild>
					<Button variant="outline">
						Criar pedido <PlusCircleIcon className="size-4 ml-4" />
					</Button>
				</DialogTrigger>
			</TableActions>
			<HandleRequest />
			{!!requests.length && (
				<Button
					variant="destructive"
					onClick={() => {
						saveToLocalStorage(LOCAL_STORAGE_REQUEST, []);
						setRequests([]);
					}}
				>
					Excluir pedidos <TrashIcon className="size-4 ml-4" />
				</Button>
			)}
		</div>
	);
};
