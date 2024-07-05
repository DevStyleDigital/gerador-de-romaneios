import type { RequestType } from "@/types/request";
import { suggest } from "@/utils/spellchecker";
import type { CSVLoad } from "..";
import { orderFoods } from "./order-data";

function formatCSVName(v: string) {
  return v.trim().replaceAll(/\s{2,}/g, " ");
}

function compareStrings(str1: string, str2: string) {
  return (
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
    str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
    str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );
}

export async function CsvLoad({ item }: CSVLoad): Promise<RequestType | null> {
  let status: RequestType["status"] = "success";
  const issues: RequestType["issues"] = [];
  const foods: RequestType["foods"] = [];
  let totalWeight = 0;
  let totalValue = 0;

  if (
    item.school.csv_name &&
    formatCSVName(item.school.csv_name).toLocaleLowerCase() !==
      formatCSVName(item.school.default_csv_name).toLocaleLowerCase()
  ) {
    status = "warning";
    issues.push("name");
  }

  const dictionaryFoods = item.cityHallFoods.map(({ name }) => name);
  for (let i = 0; i < item.foods.length; i++) {
    const food = item.foods[i];
    food.name = food.name ? formatCSVName(food.name) : "";

    const [foodName, index] = suggest(food.name, dictionaryFoods);
    let issue: null | string = null;

    if (!foodName) {
      if (!issues.includes("food-not-exists")) issues.push("food-not-exists");
      status = "error";
      foods.push({
        cityHallFoodId: null,
        cooperativeId: food.cooperative,
        quantity: food.quantity,
        id: i,
        name: food.name,
        price: undefined,
        type: "kg",
        weight: undefined,
        issue: "food-not-exists",
      });
      continue;
    }
    const cityHallFood = item.cityHallFoods[index];

    totalWeight += Number(cityHallFood.weight || 1) * food.quantity;
    totalValue += Number(cityHallFood.value) * food.quantity;

    if (!compareStrings(food.name, cityHallFood.name)) {
      if (status !== "error") status = "warning";
      if (!issues.includes("food-name")) issues.push("food-name");
      issue = "food-name";
    }

    foods.push({
      id: i,
      cityHallFoodId: `${cityHallFood.id}?${item.cityHallId}`,
      cooperativeId: food.cooperative,
      quantity: food.quantity,
      name: food.name,
      price: undefined,
      type: undefined,
      weight: undefined,
      issue,
    });
  }

  if (totalWeight === 0) {
    return null;
  }

  return {
    ...item,
    totalValue,
    totalWeight,
    issues,
    status,
    foods: orderFoods(foods),
  };
}
