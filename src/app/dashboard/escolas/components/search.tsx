"use client";
import { Combobox } from "@/components/comboboxes";
import { Search } from "@/components/search";
import { Label } from "@/components/ui/label";
import type { CityHall } from "@/types/city-hall";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const SearchContainer = ({
	cityHalls,
}: {
	cityHalls: CityHall[];
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [value, setValue] = React.useState<string | undefined>(
		searchParams.get("prefeitura") || undefined,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: not needed
	React.useEffect(() => {
		const query = new URLSearchParams(`?${searchParams.toString()}`);
		const key = "prefeitura";

		if (searchParams.has(key)) query.set(key, value || "");
		else query.append(key, value || "");

		const time = setTimeout(() => {
			query.delete("page");
			query.delete("per_page");
			router.push(`?${query.toString()}`);
		}, 500);

		return () => {
			clearTimeout(time);
		};
	}, [value]);

	return (
		<div className="flex gap-4 w-fit self-start">
			<Search defaultValue={searchParams.get("search") || undefined} />
			<div className="relative">
				<Label>Selecione uma prefeitura:</Label>
				<Combobox
					data={cityHalls}
					value={value}
					setValue={(v) => setValue((v as string)?.split(" ")[0])}
					id="cityhall_id"
					label="prefeitura"
				/>
			</div>
		</div>
	);
};
