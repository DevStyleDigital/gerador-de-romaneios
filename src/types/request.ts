import type { Food } from "./city-hall";
import type { School } from "./school";

type RequestFood = {
	cooperativeId?: string;
	id: number;
	cityHallFoodId: Food["id"] | null;
	quantity?: number;
	name: string | undefined;
	price: number | undefined;
	weight: number | undefined;
	type: Food["type"] | undefined;
	issue: string | null;
};

export type RequestType = {
	id: string;
	school: {
		id: string;
		default_csv_name: string;
		csv_name: string;
		name: string;
		number: number;
	};
	cityHallId: string;
	foods: RequestFood[];
	totalWeight: number;
	totalValue: number;
	csvIndex: number;
	status: "success" | "error" | "warning";
	issues: string[];
};

export type RequestTypeDetailed = {
	foods: RequestFood[];
	school: School;
	cityHall: {
		emblem: string;
		name: string;
		phone: string;
		cnpj: string;
	};
	cooperative: {
		id: string;
		emblem: string;
		name: string;
		phone: string;
		cnpj: string;
	};
	route: number;
	date: string;
};
