"use client";
import { Button } from "@/components/ui/button";
import { suggest } from "@/utils/spellchecker";
import { useRequests } from "../contexts/resquests";
import {
	LOCAL_STORAGE_REQUEST,
	saveToLocalStorage,
} from "../utils/loacal-storage";
import { TableActions } from "./actions/table";
import { DataTable } from "./table";

export const Table = () => {
	const { requests, setRequests } = useRequests();

	return (
		<DataTable
			columns={[
				{
					accessorKey: "number",
					header: "Numero",
					id: "id",
					cell: ({ row }) => (
						<span className="w-24 block opacity-65">
							{row.original.school.number}
						</span>
					),
				},
				{
					accessorKey: "issues",
					header: "Problemas encontrados",
					id: "issues",
					cell: ({ row }) => (
						<span className="font-medium">
							{row.original.issues.includes("food-not-exists")
								? "Possui produtos não encontrados"
								: row.original.issues.includes("food-name")
									? "Possui produtos com nomes modificados"
									: row.original.issues.includes("name")
										? `Nome da escola não confere: ${row.original.school.default_csv_name}`
										: "Tudo OK"}
						</span>
					),
				},
				{
					accessorKey: "name",
					header: "Nome da Escola",
					id: "name",
					enableColumnFilter: true,
					cell: ({ row }) => row.original.school.name,
					filterFn: (row, _, filterValue) => {
						return !!suggest(filterValue, [row.original.school.name], 87)[0];
					},
				},
				{
					accessorKey: "weight",
					header: "Peso (kg)",
					cell: ({ row }) => (
						<span className="w-[84px] block">
							{row.original.totalWeight.toFixed(2)}
						</span>
					),
				},
				{
					id: "actions",
					enableHiding: false,
					cell: ({ row, table }) => {
						return (
							<div className="flex gap-4 items-center">
								<TableActions request={row.original} index={row.index} />
								{row.original.status === "warning" && (
									<Button
										size="sm"
										variant="outline"
										onClick={() =>
											setRequests((prev) => {
												prev[row.index].issues = [];
												prev[row.index].status = "success";
												saveToLocalStorage(LOCAL_STORAGE_REQUEST, prev);
												return [...prev];
											})
										}
									>
										Liberar
									</Button>
								)}
							</div>
						);
					},
				},
			]}
			data={requests}
		/>
	);
};
