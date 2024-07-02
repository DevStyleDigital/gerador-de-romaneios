"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import type { RequestType } from "@/types/request";
import React from "react";
import { useRequests } from "./contexts/resquests";

export function getTotalRequestsWeight(requests: RequestType[]) {
	return requests.reduce((acc, request) => {
		return acc + request.totalWeight;
	}, 0);
}

export function getTotalRequestsPrice(requests: RequestType[]) {
	return (
		requests.reduce((acc, request) => {
			return acc + request.totalValue;
		}, 0) / 100
	);
}

export const Infos = () => {
	const { requests, pricesByCooperatives } = useRequests();

	return (
		<Card>
			<CardContent className="flex flex-col gap-2">
				<div className="grid grid-cols-1 gap-2 pt-6 sm:grid-cols-3">
					<div className="flex flex-col gap-1">
						<CardTitle className="text-sm font-medium">
							Total de Escolas
						</CardTitle>
						<CardDescription className="text-2xl font-bold">
							{requests.length}
						</CardDescription>
					</div>
					<div className="flex flex-col gap-1">
						<CardTitle className="text-sm font-medium">
							Total de KG (~)
						</CardTitle>
						<CardDescription className="text-2xl font-bold">
							{getTotalRequestsWeight(requests).toFixed(2)} Kg
						</CardDescription>
					</div>
					<div className="flex flex-col gap-1">
						<CardTitle className="text-sm font-medium">Valor Total</CardTitle>
						<CardDescription className="text-2xl font-bold">
							{getTotalRequestsPrice(requests).toLocaleString("pt-BR", {
								currency: "BRL",
								style: "currency",
							})}
						</CardDescription>
					</div>
				</div>
			</CardContent>
			{!!pricesByCooperatives.length && (
				<CardContent className="flex flex-col gap-2">
					<div className="grid grid-cols-1 gap-2 pt-6 sm:grid-cols-3">
						{pricesByCooperatives.map((cooperative, i) => (
							<div key={i.toString()} className="flex flex-col gap-1">
								<CardTitle className="text-2xl font-bold max-w-[250px] truncate">
									{cooperative.name}
								</CardTitle>
								<CardDescription className="text-lg">
									{(cooperative.price / 100).toLocaleString("pt-BR", {
										currency: "BRL",
										style: "currency",
									})}
									<br />
									{cooperative.weight.toFixed(2)} Kg
								</CardDescription>
							</div>
						))}
					</div>
				</CardContent>
			)}
		</Card>
	);
};
