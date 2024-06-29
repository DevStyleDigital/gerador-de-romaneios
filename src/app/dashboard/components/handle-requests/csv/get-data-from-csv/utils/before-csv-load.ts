import { toast } from "@/components/ui/use-toast";
import type { CityHall } from "@/types/city-hall";
import type { CSVLoad } from "..";
import type { RequestsContextProps } from "../../../contexts/resquests";

export async function beforeCSVLoad(
	data: CSVLoad["defaultData"],
	cityHalls: RequestsContextProps["cityHalls"],
) {
	const dataFormatted = data.map(
		({ id, fornecedora, apelido, nome, ...rest }, i) => {
			if (!id?.length || !fornecedora?.length) {
				toast({
					description: `Linha ${i + 1} não possui ID ou fornecedora`,
					variant: "destructive",
				});

				return null;
			}

			let cityHallId: string | undefined = undefined;
			let cityHallFoods: CityHall["foods"] = [];
			let school:
				| RequestsContextProps["cityHalls"][number]["schools"][number]
				| undefined;
			for (const cityHall of cityHalls) {
				const hasSchool = cityHall.schools.findIndex(
					(cityHallSchool) => Number(cityHallSchool.id) === Number(id),
				);

				if (hasSchool > -1) {
					cityHallId = cityHall.id;
					cityHallFoods = cityHall.foods;
					school = cityHall.schools[hasSchool];
					break;
				}
			}

			if (!cityHallId?.length) {
				toast({
					description: `o ID da escola na linha ${i + 1} não possui prefeitura`,
					variant: "destructive",
				});
				return null;
			}
			const cooperative = Number(fornecedora.split(" ")[0]);
			if (Number.isNaN(cooperative)) {
				toast({
					description: `Linha ${
						i + 1
					} não foi especificado o id da fornecedora. Certifique-se de mandar o id "<id> <nome da fornecedora>"`,
					variant: "destructive",
				});
				return null;
			}

			return {
				school: {
					id,
					default_csv_name: school?.csv_name,
					csv_name: nome,
					name: school?.name,
					number: school?.number,
				},
				csvIndex: i,
				id,
				foods: Object.entries(rest)
					.map(([key, value]) =>
						!Number.isNaN(Number(value)) && Number(value) > 0
							? {
									name: key,
									quantity: Number(value),
									cooperative: cooperative.toString(),
								}
							: null,
					)
					.filter((v) => !!v),
				cityHallId,
				cityHallFoods,
			} as CSVLoad["item"];
		},
	);

	return dataFormatted;
}
