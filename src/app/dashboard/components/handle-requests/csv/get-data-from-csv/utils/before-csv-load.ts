import type { CityHall } from "@/types/city-hall";
import type { CSVLoad } from "..";
import type { RequestsContextProps } from "../../../contexts/resquests";

export async function beforeCSVLoad(
	data: CSVLoad["defaultData"],
	cityHalls: RequestsContextProps["cityHalls"],
) {
	const dataFormatted = data.map(
		({ id, apelido, fornecedora, nome, ...rest }, i) => {
			if (!id.length || !apelido.length || !fornecedora.length || !nome.length)
				return null;

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

			if (!cityHallId?.length) return null;

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
									cooperative: fornecedora,
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
