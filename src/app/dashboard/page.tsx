import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/services/supabase/server";
import type { Cooperative } from "@/types/cooperative";
import { PackageIcon } from "lucide-react";
import {
	type RequestsContextProps,
	RequestsProvider,
} from "./components/handle-requests/contexts/resquests";
import { GenerateRequestsCsvTemplate } from "./components/handle-requests/csv/generate-csv-template";
import { GetRequestsFromCsv } from "./components/handle-requests/csv/get-data-from-csv";
import { Table } from "./components/handle-requests/table";

export default async function Page() {
	const supabase = createClient(["cityhalls", "cooperatives"]);

	const cityHalls = (await supabase
		.from("cityhalls")
		.select("*, schools(id,number,name,csv_name)")
		.then((res) => {
			if (!res.data || res.error) return [];
			return res.data;
		})) as RequestsContextProps["cityHalls"];

	const cooperatives = (await supabase
		.from("cooperatives")
		.select("*")
		.then((res) => {
			if (!res.data || res.error) return [];
			return res.data;
		})) as Cooperative[];

	return (
		<RequestsProvider cityHalls={cityHalls} cooperatives={cooperatives}>
			<Card>
				<CardHeader className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2" />
					<div className="flex max-md:flex-col items-center justify-between gap-4 w-full">
						<CardTitle>
							<div className="flex items-center gap-2">
								<PackageIcon className="h-6 w-6" />
								Pedidos
							</div>
						</CardTitle>
						<div className="flex gap-4 flex-wrap items-center justify-center">
							<GenerateRequestsCsvTemplate />
							<GetRequestsFromCsv />
						</div>
					</div>
				</CardHeader>
				<Table />
			</Card>
		</RequestsProvider>
	);
}
