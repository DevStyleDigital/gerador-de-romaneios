import { Combobox } from "@/components/comboboxes";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Food } from "@/types/city-hall";
import type { RequestType } from "@/types/request";
import { cn } from "@/utils/cn";
import { AlertTriangleIcon, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRequests } from "../../../contexts/resquests";
import { useFood } from "./food-context";
import { DataTable } from "./table";

export const Foods = ({
	request,
	setCurrentRequest,
}: {
	request: RequestType;
	setCurrentRequest: React.Dispatch<React.SetStateAction<RequestType>>;
}) => {
	const { cooperatives } = useRequests();
	return (
		<Card className="mt-12">
			<CardHeader>
				<CardTitle>Pedidos</CardTitle>
				<CardDescription>
					Para uma alteração mais detalhada nos pedidos vá até "
					<Link
						href={`/dashboard/prefeituras/${request.cityHallId}`}
						className="italic hover:text-primary hover:underline underline-offset-2"
					>
						prefeituras/{request.cityHallId}
					</Link>
					"
				</CardDescription>
			</CardHeader>
			<DataTable
				request={request}
				data={request.foods}
				onClickAddNewFood={() => {
					request.foods.unshift({
						cityHallFoodId: "none",
						cooperativeId: undefined,
						id: request.foods.length,
						issue: null,
						name: "",
						type: "kg",
						price: undefined,
						quantity: undefined,
						weight: undefined,
					});

					setCurrentRequest({ ...request });
				}}
				columns={[
					{
						accessorKey: "id",
						header: "#ID",
						cell: ({ row }) => (
							<span className="w-5 block opacity-65">
								#{(row.original.id + 1).toString().padStart(4, "0")}
							</span>
						),
					},
					{
						header: "Name",
						cell: ({ row }) => {
							const { foods, food, setFood, setIssue, issue } = useFood();
							return (
								<div className="flex w-[260px] flex-col gap-2">
									<div className="relative w-full">
										<Input
											type="text"
											name="csv_name"
											id="csv_name"
											readOnly={food?.cityHallFoodId !== "none"}
											required={food?.cityHallFoodId === "none"}
											defaultValue={row.original.name}
											onChange={(ev) => {
												row.original.name = ev.target.value;
												const inputInvalid = document.getElementById(
													"has-food-invalid-page",
												) as HTMLInputElement;
												inputInvalid.setCustomValidity("");
											}}
											className={cn(
												"pr-10",
												issue === "food-name" && "border-yellow-400",
												food?.cityHallFoodId !== "none" &&
													"opacity-50 pointer-events-none",
											)}
										/>
										<AlertTriangleIcon
											className={cn(
												"size-4 absolute text-muted-foreground right-4 top-1/2 -translate-y-1/2",
												issue === "food-name" && "text-yellow-400",
												issue === "food-not-exists" && "text-red-500",
											)}
										/>
									</div>
									<Combobox
										data={foods.map(({ cityHallFoodId, name }) => ({
											id: cityHallFoodId?.toString() || "none",
											name: name || "Nenhum",
										}))}
										label="alimento"
										fallback="Alimento de outra prefeitura"
										id="cityhall_id"
										setValue={(id) => {
											const food = foods.find(
												(item) => id === item.cityHallFoodId,
											);
											setFood(food);

											row.original.cityHallFoodId = id || null;
											row.original.name = food?.name;
											row.original.price = food?.value as number;
											row.original.type = food?.type;
											row.original.weight = food?.weight as number;
											row.original.issue = null;
											const inputInvalid = document.getElementById(
												"has-food-invalid-page",
											) as HTMLInputElement;
											inputInvalid.setCustomValidity("");

											setIssue(null);
										}}
										value={food?.cityHallFoodId?.toString() || ""}
									/>
								</div>
							);
						},
					},
					{
						header: "Quantidade & Fornecedora",
						cell: ({ row }) => {
							const [cooperative, setCooperative] = React.useState<
								string | undefined
							>(row.original.cooperativeId || undefined);
							return (
								<div className="flex w-[260px] flex-col gap-2">
									<Input
										type="number"
										min={0.01}
										step={0.01}
										name="quantity"
										id="quantity"
										required
										defaultValue={row.original.quantity}
										onChange={(ev) => {
											row.original.quantity = Number(ev.target.value);
											const inputInvalid = document.getElementById(
												"has-food-invalid-page",
											) as HTMLInputElement;
											inputInvalid.setCustomValidity("");
										}}
									/>
									<Combobox
										data={cooperatives}
										label="fornecedora"
										id="cooperative"
										setValue={(id) => {
											setCooperative(id);
											if (id) row.original.cooperativeId = id.toString();
											const inputInvalid = document.getElementById(
												"has-food-invalid-page",
											) as HTMLInputElement;
											inputInvalid.setCustomValidity("");
										}}
										value={cooperative}
									/>
								</div>
							);
						},
					},
					{
						header: "Valor (R$) & Peso (KG)",
						cell: ({ row }) => {
							const { food } = useFood();
							return (
								<div className="grid grid-cols-[32px_1fr] w-[260px] items-center flex-col gap-2">
									<Label htmlFor="price">R$:</Label>
									<Input
										type="number"
										min={0.01}
										step={0.01}
										name="price"
										id="price"
										required
										value={food?.value ? Number(food.value) / 100 : undefined}
										defaultValue={
											Number(food?.value || row.original.price) / 100
										}
										readOnly={food?.cityHallFoodId !== "none"}
										placeholder="Preço do alimento"
										className={
											food?.cityHallFoodId !== "none"
												? "opacity-50 pointer-events-none"
												: ""
										}
										onChange={(ev) => {
											row.original.price = Number(ev.target.value) * 100;
											const inputInvalid = document.getElementById(
												"has-food-invalid-page",
											) as HTMLInputElement;
											inputInvalid.setCustomValidity("");
										}}
									/>
									<Label htmlFor="weight">KG:</Label>
									<Input
										type="number"
										min={0.01}
										step={0.01}
										name="weight"
										id="weight"
										required
										placeholder="Peso do alimento"
										readOnly={food?.cityHallFoodId !== "none"}
										className={
											food?.cityHallFoodId !== "none"
												? "opacity-50 pointer-events-none"
												: ""
										}
										value={food?.weight}
										defaultValue={Number(food?.weight || row.original.weight)}
										onChange={(ev) => {
											row.original.weight = Number(ev.target.value);
											const inputInvalid = document.getElementById(
												"has-food-invalid-page",
											) as HTMLInputElement;
											inputInvalid.setCustomValidity("");
										}}
									/>
								</div>
							);
						},
					},
					{
						header: "Tipo do pacote & Ações",
						size: 100,
						cell: ({ row }) => {
							const { food, issue } = useFood();

							const [type, setType] = React.useState<string | undefined>(
								food?.type || row.original.type || undefined,
							);
							return (
								<div className="flex flex-col items-end gap-2">
									<ToggleGroup
										type="single"
										size="sm"
										value={type}
										disabled={food?.cityHallFoodId !== "none"}
										onValueChange={(value) => {
											setType(value);
											row.original.type = value as "kg";
											const inputInvalid = document.getElementById(
												"has-food-invalid-page",
											) as HTMLInputElement;
											inputInvalid.setCustomValidity("");
										}}
										variant="outline"
									>
										<input
											type="hidden"
											id={`food-type-${row.original.id}`}
											name={`food-type-${row.original.id}`}
											form="upsert"
											value={type}
										/>
										<TooltipProvider>
											<Tooltip>
												<ToggleGroupItem asChild value="kg">
													<TooltipTrigger>KG</TooltipTrigger>
												</ToggleGroupItem>
												<TooltipContent>Quilograma</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<TooltipProvider>
											<Tooltip>
												<ToggleGroupItem asChild value="ud">
													<TooltipTrigger>Und.</TooltipTrigger>
												</ToggleGroupItem>
												<TooltipContent>Unidade</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<TooltipProvider>
											<Tooltip>
												<ToggleGroupItem asChild value="mc">
													<TooltipTrigger>Maço</TooltipTrigger>
												</ToggleGroupItem>
												<TooltipContent>Maço</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</ToggleGroup>
									<div className="flex gap-2 items-center justify-end">
										{issue === "food-name" && (
											<Button
												type="button"
												size="sm"
												variant="outline"
												onClick={() =>
													setCurrentRequest((prev) => {
														prev.foods[row.index].issue = null;
														return { ...prev };
													})
												}
											>
												Liberar
											</Button>
										)}
										<Button
											type="button"
											size="icon"
											className="p-2 w-fit h-fit"
											variant="destructive"
											onClick={() => {
												request.foods.splice(row.index, 1);
												setCurrentRequest({ ...request });
												const inputInvalid = document.getElementById(
													"has-food-invalid-page",
												) as HTMLInputElement;
												inputInvalid.setCustomValidity("");
											}}
										>
											<Trash className="size-4" />
											<span className="sr-only">
												Excluir alimento do pedido
											</span>
										</Button>
									</div>
								</div>
							);
						},
					},
				]}
			/>
		</Card>
	);
};
