"use client";
import type { CityHall } from "@/types/city-hall";
import type { Cooperative } from "@/types/cooperative";
import type { RequestType } from "@/types/request";
import React from "react";
import {
	LOCAL_STORAGE_REQUEST,
	getFromLocalStorage,
} from "../utils/loacal-storage";

export type RequestsContextProps = {
	requests: RequestType[];
	setRequests: React.Dispatch<React.SetStateAction<RequestType[]>>;
	setLoadingRequests: (value: boolean) => void;
	loadingRequests: boolean;
	cityHalls: (CityHall & {
		schools: { id: number; number: number; name: string; csv_name: string }[];
	})[];
	cooperatives: Cooperative[];
	pricesByCooperatives: {
		name: string;
		price: number;
		weight: number;
	}[];
	routes: {
		weight: number;
		requestIds: Set<string>;
	}[];
	setRoutes: React.Dispatch<
		React.SetStateAction<
			{
				weight: number;
				requestIds: Set<string>;
			}[]
		>
	>;
};
const RequestsContext = React.createContext<RequestsContextProps>(
	{} as RequestsContextProps,
);
export const useRequests = () => React.useContext(RequestsContext);

export const RequestsProvider = ({
	children,
	cityHalls,
	cooperatives,
}: {
	children: React.ReactNode;
	cityHalls: RequestsContextProps["cityHalls"];
	cooperatives: Cooperative[];
}) => {
	const [requests, setRequests] = React.useState<RequestType[]>([]);
	const [loadingRequests, setLoadingRequests] = React.useState(false);
	const [pricesByCooperatives, setPricesByCooperatives] = React.useState<
		{ name: string; price: number; weight: number }[]
	>([]);
	const [routes, setRoutes] = React.useState<
		{
			weight: number;
			requestIds: Set<string>;
		}[]
	>([
		{
			weight: 0,
			requestIds: new Set() as Set<string>,
		},
	]);

	React.useEffect(() => {
		const storedData = getFromLocalStorage(LOCAL_STORAGE_REQUEST);
		if (storedData) {
			setLoadingRequests(true);
			setRequests(storedData);
			setLoadingRequests(false);
		}
	}, []);
	React.useEffect(() => {
		setPricesByCooperatives(
			cooperatives.reduce(
				(acc, cooperative) => {
					let totalPrice = 0;
					let totalWeight = 0;
					for (const request of requests) {
						const foodsOfCooperative = request.foods.filter(
							({ cooperativeId }) =>
								Number(cooperativeId) === Number(cooperative.id),
						);

						for (const item of foodsOfCooperative) {
							const foodCityHall = cityHalls
								.find(({ id }) => id === request.cityHallId)
								?.foods?.find(
									({ id }) =>
										item.cityHallFoodId === `${id}?${request.cityHallId}`,
								);

							totalPrice += foodCityHall?.value
								? Number(foodCityHall.value) * (item.quantity || 1)
								: item.price
									? item.price * (item.quantity || 1)
									: 0;
							totalWeight += foodCityHall?.weight
								? Number(foodCityHall.weight) * (item.quantity || 1)
								: item.weight
									? item.weight * (item.quantity || 1)
									: 0;
						}
					}

					if (totalPrice || totalWeight) {
						acc.push({
							name: cooperative.name,
							price: totalPrice,
							weight: totalWeight,
						});
					}

					return acc;
				},
				[] as { name: string; price: number; weight: number }[],
			),
		);
	}, [requests, cooperatives, cityHalls]);

	const values = React.useMemo(() => {
		return {
			requests,
			setRequests,
			loadingRequests,
			setLoadingRequests,
			cityHalls,
			cooperatives,
			routes,
			setRoutes,
			pricesByCooperatives,
		};
	}, [
		requests,
		cityHalls,
		cooperatives,
		routes,
		loadingRequests,
		pricesByCooperatives,
	]);

	return (
		<RequestsContext.Provider value={values}>
			{children}
		</RequestsContext.Provider>
	);
};
