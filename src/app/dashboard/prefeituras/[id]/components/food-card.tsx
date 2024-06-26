"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Food } from "@/types/city-hall";
import { PlusCircle, TrashIcon } from "lucide-react";
import React from "react";

export const FoodCard = ({
	foods: foodsInitial = [
		{ name: "", id: 1, weight: "", type: "kg", value: undefined },
	],
}: {
	foods?: Food[];
}) => {
	const [foods, setFoods] = React.useState(foodsInitial);

	return (
		<Card className="overflow-auto col-span-full">
			<CardHeader>
				<CardTitle>Alimentos</CardTitle>
				<CardDescription>
					Detalhe os alimentos que a prefeitura possui
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">id</TableHead>
							<TableHead>Nome</TableHead>
							<TableHead className="w-[120px]">Valor (R$)</TableHead>
							<TableHead className="w-[120px]">Peso (KG)</TableHead>
							<TableHead className="w-[100px]">Tipo do Pacote</TableHead>
							{foods.length > 1 && (
								<TableHead className="w-[50px]">
									<span className="sr-only">Ação</span>
								</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{foods.map((food, i) => (
							<TableRow key={food.id}>
								<TableCell className="font-semibold">
									#
									{food.id < 10
										? `00${food.id}`
										: food.id < 100
											? `0${food.id}`
											: food.id}
								</TableCell>
								<TableCell className="min-w-[240px]">
									<Label>
										<span className="sr-only">Nome do Alimento</span>
										<Input
											id={`food-name-${food.id}`}
											name={`food-name-${food.id}`}
											form="upsert"
											value={food.name}
											onChange={({ target: { value } }) => {
												setFoods((prev) => {
													prev[i].name = value;
													return [...prev];
												});
											}}
											required
											placeholder="Nome do Alimento"
										/>
									</Label>
								</TableCell>
								<TableCell className="min-w-40">
									<Label>
										<span className="sr-only">Valor do Alimento em Real</span>
										<Input
											id={`food-value-${food.id}`}
											name={`food-value-${food.id}`}
											form="upsert"
											className=""
											value={
												food.value
													? (Number(food.value) / 100).toLocaleString("pt-BR", {
															currency: "BRL",
															style: "currency",
														})
													: undefined
											}
											onChange={({ target: { value } }) => {
												const newValue = value?.replaceAll(/\D/g, "");

												setFoods((prev) => {
													prev[i].value = newValue;
													return [...prev];
												});
											}}
											required
											type="text"
											placeholder="R$ ..."
										/>
									</Label>
								</TableCell>
								<TableCell className="min-w-32">
									<Label>
										<span className="sr-only">Peso do Alimento em KG</span>
										<Input
											id={`food-weight-${food.id}`}
											name={`food-weight-${food.id}`}
											form="upsert"
											value={food.weight}
											onChange={({ target: { value } }) => {
												setFoods((prev) => {
													prev[i].weight = value.trim();
													return [...prev];
												});
											}}
											required
											type="number"
											placeholder="Peso"
										/>
									</Label>
								</TableCell>
								<TableCell>
									<ToggleGroup
										type="single"
										value={food.type}
										onValueChange={(value) => {
											setFoods((prev) => {
												prev[i].type = value as 'kg';
												return [...prev];
											});
										}}
										variant="outline"
									>
										<input
											type="hidden"
											id={`food-type-${food.id}`}
											name={`food-type-${food.id}`}
											form="upsert"
											value={food.type}
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
								</TableCell>
								{foods.length > 1 && (
									<TableCell>
										<Button
											onClick={() => {
												setFoods((prev) => {
													prev.splice(i, 1);
													return [...prev];
												});
											}}
											type="button"
											size="icon"
											variant="destructive"
										>
											<TrashIcon className="w-4 h-4" />
											<span className="sr-only">Deletar alimento</span>
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter className="justify-center border-t p-4">
				<Button
					type="button"
					onClick={() => {
						setFoods((prev) => [
							...prev,
							{
								id: prev[prev.length - 1].id + 1,
								name: "",
								type: "kg",
								weight: "",
								value: undefined,
							},
						]);
					}}
					size="sm"
					variant="ghost"
					className="gap-1"
				>
					<PlusCircle className="h-3.5 w-3.5" />
					Adicionar Alimento
				</Button>
			</CardFooter>
		</Card>
	);
};
