import type { RequestType } from "@/types/request";
import { suggest } from "@/utils/spellchecker";
import type { CSVLoad } from "..";
import { orderFoods } from "./order-data";

function formatCSVName(v: string) {
  return v
    .replaceAll(/\s{2,}/g, " ")
    .trim();
}

function compareStrings(str1: string, str2: string) {
  const str1Normalize = str1
    .toLowerCase()
    .normalize("NFD")
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
    .replace(/[\u0300-\u036f()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .split(" ");

  const str2Normalize = str2
    .toLowerCase()
    .normalize("NFD")
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
    .replace(/[\u0300-\u036f()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .split(" ");

  let valid = false;
  if (
    str1Normalize.length > 0 &&
    str2Normalize.length > 0 &&
    str2Normalize[0].includes(str1Normalize[0])
  ) {
    const intersection = str1Normalize.filter((item) =>
      str2Normalize.includes(item)
    );
    if (intersection.length >= 1) valid = true;
    else valid = false;
  } else {
    valid = false;
  }

  return valid;
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
    food.name = food.name ? food.name : "";
    const newName = formatCSVName(food.name).replaceAll(/\(.*\)/g, "");

    const [foodName, index] = suggest(
      newName,
      dictionaryFoods
    ).filter((bestMatch) => {
      return bestMatch[0]?.length
        ? compareStrings(newName, bestMatch[0])
        : false;
    })[0] || [undefined, -1];

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

    const foodNameValidation = compareStrings(food.name, cityHallFood.name);
    if (!foodNameValidation) {
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
