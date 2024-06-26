'use children'
import type { RequestType } from "@/types/request";
import React from "react";
import { useRequests } from "../../../contexts/resquests";
import type { Food } from "@/types/city-hall";

const FoodContext = React.createContext({} as {
  foodId: number | undefined;
  setFoodId: React.Dispatch<React.SetStateAction<number | undefined>>;
  foods: Food[];
});
export const useFood = () => React.useContext(FoodContext);

export const FoodProvider = ({ children, defaultFood, request }: { children: React.ReactNode; defaultFood: RequestType['foods'][number]; request: RequestType; }) => {
  const { cityHalls } = useRequests();
  const [foodId, setFoodId] = React.useState<number | undefined>(
    defaultFood.cityHallFoodId || undefined
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const foods = React.useMemo(
    () =>
      cityHalls.find(({ id }) => id === request.cityHallId)
        ?.foods || [],
    [request.cityHallId]
  );

  return <FoodContext.Provider value={{ foodId, setFoodId, foods }}>{children}</FoodContext.Provider>;
};
