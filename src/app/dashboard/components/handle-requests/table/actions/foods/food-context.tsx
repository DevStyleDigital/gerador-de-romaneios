"use children";
import type { Food } from "@/types/city-hall";
import type { RequestType } from "@/types/request";
import React, { useEffect } from "react";
import { useRequests } from "../../../contexts/resquests";

const FoodContext = React.createContext(
	{} as {
		food: Partial<Food> | undefined;
		setFood: React.Dispatch<React.SetStateAction<Partial<Food> | undefined>>;
		foods: Partial<Food>[];
	},
);
export const useFood = () => React.useContext(FoodContext);

export const FoodProvider = ({
	children,
	defaultFood,
	request,
}: {
	children: React.ReactNode;
	defaultFood: RequestType["foods"][number];
	request: RequestType;
}) => {
	const { cityHalls } = useRequests();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const foods = React.useMemo(
		() =>
			[{ id: -1, name: "Nenhuma" }].concat(
				cityHalls.find(({ id }) => id === request.cityHallId)?.foods || [],
			),
		[request.cityHallId],
	);
	const foodSelected = foods.find(
		(item) => Number(defaultFood.cityHallFoodId) === item.id,
	);

	const [food, setFood] = React.useState<Partial<Food> | undefined>(
		foodSelected,
	);

	return (
		<FoodContext.Provider value={{ foods, food, setFood }}>
			{children}
		</FoodContext.Provider>
	);
};
