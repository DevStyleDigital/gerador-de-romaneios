"use client";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function MaxWeight({
	maxWeight,
	setMaxWeight,
}: {
	setMaxWeight: React.Dispatch<React.SetStateAction<number>>;
	maxWeight: number;
}) {
	function onClick(adjustment: number) {
		setMaxWeight(maxWeight + adjustment);
	}

	return (
		<Card className="lg:max-w-fit h-fit lg:min-w-56">
			<CardHeader className="pb-4">
				<CardTitle className="text-base">Peso Máximo</CardTitle>
				<CardDescription>
					Diga o peso máximo que deseja colocar nessa rota.
				</CardDescription>
			</CardHeader>
			<CardContent className="pb-2">
				<div className="flex items-center justify-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 shrink-0 rounded-full"
						onClick={() => onClick(-10)}
						disabled={maxWeight <= 0}
					>
						<Minus className="h-4 w-4" />
						<span className="sr-only">Diminuir</span>
					</Button>
					<div className="flex-1 text-center">
						<div className="text-5xl font-bold tracking-tighter">
							{maxWeight}
						</div>
						<div className="text-[0.70rem] uppercase text-muted-foreground">
							Peso máximo
						</div>
					</div>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 shrink-0 rounded-full"
						onClick={() => onClick(10)}
					>
						<Plus className="h-4 w-4" />
						<span className="sr-only">Aumentar</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
