"use client";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const Search = ({ defaultValue }: { defaultValue?: string }) => {
	const router = useRouter();
	const [search, setSearch] = React.useState(defaultValue || "");
	const searchParams = useSearchParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies: not needed
	React.useEffect(() => {
		const query = new URLSearchParams(`?${searchParams.toString()}`);
		const key = "search";

		if (searchParams.has(key)) query.set(key, search || "");
		else query.append(key, search || "");

		const time = setTimeout(() => {
			query.delete("page");
			query.delete("per_page");
			router.push(`?${query.toString()}`);
		}, 500);

		return () => {
			clearTimeout(time);
		};
	}, [search]);

	return (
		<div className="w-full relative">
			<Label>Pesquise o item desejado:</Label>
			<SearchIcon className="size-4 absolute top-[calc(50%+12px)] left-2 -translate-y-1/2" />
			<Input
				type="search"
				className="max-w-sm w-full pl-8"
				placeholder="Pesquisar..."
				defaultValue={defaultValue}
				onChange={({ target: { value } }) => {
					setSearch(value.trim());
				}}
			/>
		</div>
	);
};
