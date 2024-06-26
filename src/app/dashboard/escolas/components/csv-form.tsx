"use client";
import { CSVForm } from "@/components/csv-form";
import { useSearchParams } from "next/navigation";
import React from "react";
import { handleSchools } from "../actions";

export const CsvForm = ({ lastTag = 0 }: { lastTag?: number }) => {
	const searchParams = useSearchParams();

	return (
		<>
			<CSVForm
				action={handleSchools}
				keys={[
					"nome",
					"endereco",
					"posicao no pedido",
					"apelido",
					"numero",
				].concat(
					searchParams.get("prefeitura")?.length ? [] : ["id prefeitura"],
				)}
				onCSVLoad={async ({ item, i }, withIssues) => {
					if (
						!item.nome?.length ||
						!item.endereco?.length ||
						!item["posicao no pedido"]?.length ||
						!item.apelido?.length ||
						!item.numero?.length
					) {
						withIssues.push({
							line: i + 1,
						});
						return null;
					}

					return {
						phone: item.telefone,
						name: item.nome,
						address: item.endereco,
						pos: item["posicao no pedido"],
						number: item.numero,
						route: 0,
						csv_name: item.apelido,
						id: lastTag + i + 1,
						cityhall_id:
							item["id prefeitura"] || searchParams.get("prefeitura"),
					};
				}}
			/>
		</>
	);
};
