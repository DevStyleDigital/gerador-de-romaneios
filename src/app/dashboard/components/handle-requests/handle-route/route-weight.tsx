"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Weight } from "lucide-react";
import * as React from "react";

export function RouteWeight({
	maxWeight,
	weight,
}: { weight: number; maxWeight: number }) {
	const getWeightClass = () => {
		if (weight > maxWeight + 10) return "text-red-500";
		if (weight < maxWeight - 10) return "text-white";
		return "text-green-500";
	};

	const getWeightMessage = () => {
		if (weight > maxWeight + 10)
			return "A rota está mais pesada do que o peso definido";
		if (weight > maxWeight) return "Peso máximo atingido";
		if (weight === maxWeight) return "Peso máximo atingido";
		return `Faltam ${(maxWeight - weight).toFixed(1)} kgs para o peso máximo`;
	};

	const getIcon = () => {
		if (weight > maxWeight + 10)
			return (
				<div className="bg-red-500/20 p-2 rounded-full">
					<Weight className="text-red-500 w-4 h-4" />
				</div>
			);

		if (weight < maxWeight - 20) return null;

		return (
			<div className="bg-green-500/20 p-2 rounded-full">
				<CheckCircle className="text-green-500 w-4 h-4" />
			</div>
		);
	};

	return (
		<Card className="relative lg:max-w-fit h-fit lg:min-w-56">
			<div className="absolute top-1.5 right-1.5">{getIcon()}</div>
			<CardHeader className="pb-4">
				<CardTitle className="text-base">Peso da rota</CardTitle>
				<CardDescription>
					Acompanhe em tempo real o peso atual da rota.
				</CardDescription>
			</CardHeader>
			<CardContent className="pb-2">
				<div className="flex items-center justify-center space-x-2">
					<div className="flex-1 text-center">
						<p
							className={`text-5xl font-bold tracking-tighter ${getWeightClass()}`}
						>
							{weight}
						</p>
						<div className="text-[0.70rem] uppercase text-muted-foreground">
							{getWeightMessage()}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
