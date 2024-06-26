import type { RequestType } from "@/types/request";

const statusOrder: Record<string, number> = {
  "food-not-exists": 0,
  name: 1,
  "food-name": 2,
  null: 3,
};

export function orderData(data: RequestType[]) {
  return data.sort((a, b) => {
    const statusA = a.issues[0] || "null";
    const statusB = b.issues[0] || "null";
    return statusOrder[statusA] - statusOrder[statusB];
  });
}

const foodOrder: Record<string, number> = {
  "food-not-exists": 0,
  "food-name": 1,
  null: 2,
};

export function orderFoods(data: RequestType['foods']) {
  return data.sort((a, b) => {
    const statusA = a.issue || "null";
    const statusB = b.issue || "null";
    return foodOrder[statusA] - foodOrder[statusB];
  });
}