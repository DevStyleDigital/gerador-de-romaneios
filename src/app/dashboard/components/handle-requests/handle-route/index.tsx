"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash } from "lucide-react";
import React from "react";
import { useRequests } from "../contexts/resquests";
import { MaxWeight } from "./max-weight";
import { RouteWeight } from "./route-weight";
import { TableSelect } from "./table";

export const HandleRoute = () => {
	const { requests, routes, setRoutes } = useRequests();

	const [maxWeight, setMaxWeight] = React.useState(1700);
	const [currentRoute, setCurrentRoute] = React.useState("0");
	const requestsErrorValidatorInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (requestsErrorValidatorInputRef.current) {
			const hasError =
				routes.reduce((acc, { requestIds }) => acc + requestIds.size, 0) !==
				requests.length;

			if (hasError) {
				requestsErrorValidatorInputRef.current.setCustomValidity(
					"Todos os items da tabela devem ser selecionados antes de gerar o romaneio!",
				);
			} else {
				requestsErrorValidatorInputRef.current.setCustomValidity("");
			}
		}
	}, [routes, requests]);

	function filterRequests(id: string) {
		let visible = true;
		for (const route of routes) {
			if (route.requestIds.has(id)) {
				visible = false;
				break;
			}
		}
		return visible;
	}

	return (
		<div className="w-full px-4">
			<Tabs value={currentRoute} onValueChange={setCurrentRoute}>
				<div className="flex max-lg:flex-col justify-between gap-8">
					<MaxWeight setMaxWeight={setMaxWeight} maxWeight={maxWeight} />
					<div className="self-center flex justify-center items-center flex-wrap gap-4 max-w-screen-sm">
						<TabsList className="flex-wrap h-fit">
							{routes.map((route, index) => (
								<TabsTrigger key={index.toString()} value={index.toString()}>
									Rota {(Number(index) + 1).toString().padStart(2, "0")} -{" "}
									{route.weight.toFixed(2)} Kg
									{routes.length > 1 && (
										<Button
											className="h-fit w-fit p-2 ml-4"
											size="icon"
											onClick={() => {
												for (let i = 0; i < routes.length; i++) {
													if (i === index) {
														routes.splice(i, 1);
														break;
													}
												}
												setRoutes([...routes]);
												setCurrentRoute("0");
											}}
										>
											<Trash className="w-4 h-4" />{" "}
											<span className="sr-only">Deletar rota</span>
										</Button>
									)}
								</TabsTrigger>
							))}
						</TabsList>
						<Button
							variant="outline"
							onClick={() => {
								setRoutes([
									...routes,
									{
										weight: 0,
										requestIds: new Set(),
									},
								]);
								setCurrentRoute(routes.length.toString());
							}}
						>
							<Plus className="w-4 h-4 mr-4" /> Criar Rota
						</Button>
					</div>
					<RouteWeight
						schoolsAmount={routes[Number(currentRoute)].requestIds.size}
						weight={Number(routes[Number(currentRoute)].weight.toFixed(1))}
						maxWeight={maxWeight}
					/>
				</div>
			</Tabs>

			<div className="flex h-full max-lg:flex-col justify-between gap-8 mt-10">
				<div className="w-full flex flex-col gap-1 relative">
					<h3 className="h-min">Todos os Pedidos:</h3>
					<input
						type="text"
						className="sr-only top-6 left-1/2"
						form="handle-request"
						ref={requestsErrorValidatorInputRef}
					/>
					<TableSelect
						onRowClick={(request) => {
							routes[Number(currentRoute)].weight += request.weight || 0;
							routes[Number(currentRoute)].requestIds.add(request.id);
							setRoutes([...routes]);
						}}
						data={requests
							.filter(({ id }) => filterRequests(id))
							.sort((a, b) => (a.school.number || 0) - (b.school.number || 0))
							.map((request) => ({
								id: request.id!,
								name: request.school.name!,
								number: request.school.number!,
								weight: request.totalWeight!,
							}))}
					/>
				</div>
				<div className="w-full flex flex-col gap-1">
					<h3 className="h-min">
						Pedidos da Rota{" "}
						{(Number(currentRoute) + 1).toString().padStart(2, "0")}:
					</h3>
					<TableSelect
						onRowClick={(request) => {
							routes[Number(currentRoute)].weight -= request.weight || 0;
							routes[Number(currentRoute)].requestIds.delete(request.id);
							setRoutes([...routes]);
						}}
						data={requests
							.filter(({ id }) => {
								return routes[Number(currentRoute)].requestIds.has(id);
							})
							.sort((a, b) => (a.school.number || 0) - (b.school.number || 0))
							.map((request) => ({
								id: request.id!,
								name: request.school.name!,
								number: request.school.number!,
								weight: request.totalWeight!,
							}))}
					/>
				</div>
			</div>
		</div>
	);
};
