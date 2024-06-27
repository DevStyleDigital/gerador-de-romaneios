"use client";
import { CSVForm } from "@/components/csv-form";
import type { CityHall } from "@/types/city-hall";
import type { RequestType } from "@/types/request";
import { useRequests } from "../../contexts/resquests";
import {
	LOCAL_STORAGE_REQUEST,
	saveToLocalStorage,
} from "../../utils/loacal-storage";
import { beforeCSVLoad } from "./utils/before-csv-load";
import { CsvLoad } from "./utils/csv-load";
import { orderData } from "./utils/order-data";

export type CSVLoad = {
	item: Pick<RequestType, "school" | "csvIndex" | "cityHallId" | "id"> & {
		cityHallFoods: CityHall["foods"];
		foods: {
			name: string;
			quantity: number;
			cooperative: string;
		}[];
	};
	i: number;
	defaultData: Record<string, string>[];
};

export const GetRequestsFromCsv = () => {
	const { cityHalls, setRequests, requests } = useRequests();

	return (
		<CSVForm
			keys={["id", "fornecedora", "apelido", "nome"]}
			onBeforeCSVLoad={(data) => {
				return beforeCSVLoad(data, cityHalls);
			}}
			onCSVLoad={CsvLoad}
			onLoadFinish={(data: (RequestType | null)[]) => {
				const dataSelected: number[] = [];

				const newRequests = requests.map((request) => {
					let requestItem: RequestType | undefined = undefined;
					for (let i = 0; i < data.length; i++) {
						if (data[i] && request.id === data[i]?.id) {
							requestItem = data[i]!;
							dataSelected.push(i);
							break;
						}
					}

					if (requestItem) {
						if (requestItem.issues.includes("food-name")) {
							request.issues.push("food-name");
							request.status = "warning";
						}

						if (requestItem.issues.includes("food-not-exists")) {
							request.issues.push("food-not-exists");
							request.status = "error";
						}

						const newFoods = [];

						for (const foodItem of requestItem.foods) {
							let foodFind = false;
							for (const requestFood of request.foods) {
								if (
									requestFood.cityHallFoodId === foodItem.cityHallFoodId &&
									requestFood.cooperativeId === foodItem.cooperativeId
								) {
									foodFind = true;
									requestFood.quantity =
										Number(requestFood.quantity || 0) +
										Number(foodItem.quantity || 0);
									break;
								}
							}

							if (!foodFind)
								newFoods.push({
									...foodItem,
									id: foodItem.id + requestItem.foods.length,
								});
						}

						request.foods = request.foods.concat(newFoods);
						request.totalWeight += requestItem.totalWeight;
						request.totalValue += requestItem.totalValue;
					}

					return request;
				});

				const newData = data
					.filter((_, i) => !dataSelected.includes(i))
					.filter(Boolean) as RequestType[];

				const orderedData = orderData(newRequests.concat(newData));
				saveToLocalStorage(LOCAL_STORAGE_REQUEST, orderedData);
				setRequests(orderedData);
			}}
		/>
	);
};
