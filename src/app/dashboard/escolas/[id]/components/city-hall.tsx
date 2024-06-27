"use client";
import { Combobox } from "@/components/comboboxes";
import { Label } from "@/components/ui/label";
import React from "react";

export function CityHallSelect({
	cityHalls,
	cityHall,
}: { cityHalls: any[]; cityHall: string }) {
	const [value, setValue] = React.useState<string | undefined>(cityHall);

	return (
		<div className="grid gap-1">
			<Label htmlFor="pos">Selecione uma Prefeitura*</Label>
			<Combobox
				data={cityHalls}
				id="cityhall_id"
				label="prefeitura"
				form="upsert"
				setValue={setValue}
				value={value}
			/>
		</div>
	);
}
