"use children";
import type { Food } from "@/types/city-hall";
import type { RequestType } from "@/types/request";
import React, { useEffect } from "react";
import { useRequests } from "../../../contexts/resquests";
import { TableRow } from "@/components/ui/table";

	
type FoodRequest = Food & { cityHallFoodId: number | string | null; }

const FoodContext = React.createContext(
  {} as {
    food: Partial<FoodRequest> | undefined;
    setFood: React.Dispatch<React.SetStateAction<Partial<FoodRequest> | undefined>>;
    foods: Partial<FoodRequest>[];
    issue: string | null;
    setIssue: React.Dispatch<React.SetStateAction<string | null>>
  }
);
export const useFood = () => React.useContext(FoodContext);

const getStatusClassName = (status: string | null) => {
	switch (status) {
		case "food-not-exists":
			return "bg-red-500/20 border-red-500 hover:bg-red-500/40";
		case "food-name":
			return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/40";
		default:
			return "";
	}
};

export const FoodProvider = ({
  children,
  defaultFood,
  request,
  ...props
}: {
  children: React.ReactNode;
  defaultFood: RequestType["foods"][number];
  request: RequestType;
  'data-state'?: string | undefined;
}) => {
  const { cityHalls } = useRequests();

  const selectedFoods =
    cityHalls
      .find(({ id }) => id === request.cityHallId)
      ?.foods?.map(({ ...rest }) => ({
        ...rest,
        cityHallFoodId: `${rest.id}?${request.cityHallId}`,
      })) || [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const foods = React.useMemo(
    () =>
      [
        {
          id: selectedFoods.length + 1,
          name: "Nenhum",
          cityHallFoodId: 'none',
        } as any,
      ].concat(selectedFoods),
    [request.cityHallId]
  );
  const foodSelected = foods.find(
    (item) =>
      defaultFood.cityHallFoodId ===
      item.cityHallFoodId
  );

  const [food, setFood] = React.useState<Partial<Food> | undefined>(
    foodSelected
  );
  const [issue, setIssue] = React.useState<string | null>(
    defaultFood.issue
  );

  useEffect(() => {
    setIssue(defaultFood.issue);
  }, [defaultFood.issue])

  return (
    <FoodContext.Provider value={{ foods, food, setFood, issue, setIssue }}>
      <TableRow
        data-state={props['data-state']}
        className={getStatusClassName(issue)}
      >
      {children}
      </TableRow>
    </FoodContext.Provider>
  );
};
