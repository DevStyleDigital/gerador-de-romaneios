"use client";
import { CSVForm } from "@/components/csv-form";
import React from "react";
import { handleCityHalls } from "../actions";

export const CsvForm = () => {
	return (
		<>
			<CSVForm
				action={handleCityHalls}
				keys={["cnpj", "telefone", "nome", "endereco", "emblema"]}
				onCSVLoad={async (
					{ item: { cnpj, telefone, nome, endereco, emblema, ...foods }, i },
					withIssues,
				) => {
					if (
						!cnpj?.length ||
						!telefone?.length ||
						!nome?.length ||
						!endereco?.length
					) {
						withIssues.push({ line: i + 1 });
						return null;
					}

					const foodsFormatted = Object.entries(foods).reduce(
						(acc, [key, value], i) => {
							if (!(value as string).length) return acc;

							const [type, weight] = (value as string).trim().split(/\s/g);
							const isKilogram = type[0] === "k";

							return {
								// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
								...acc,
								[`food-name-${i + 1}`]: key.trim(),
								[`food-type-${i + 1}`]: isKilogram
									? "kg"
									: type[0] === "m"
										? "mc"
										: "ud",
								[`food-weight-${i + 1}`]: isKilogram
									? undefined
									: weight
										? Number(weight.replace(",", "."))
										: undefined,
							};
						},
						{},
					);

					return {
						cnpj,
						phone: telefone,
						name: nome,
						address: endereco,
						emblem: emblema,
						...foodsFormatted,
					};
				}}
			/>
		</>
	);
};
