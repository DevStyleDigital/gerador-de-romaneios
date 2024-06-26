"use server";

import { createClient } from "@/services/supabase/server";
import { revalidateTag } from "next/cache";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function trimIfString(str: any) {
	return typeof str === "string" ? str.trim() : str;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function handleCityHalls(formData: any[]) {
	const supabase = createClient();

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const dataPrepared: any[] = [];
	for (const formDataItem of formData) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const dataPreparedItem = { emblem: "emblem.png" } as any;
		for (const item of Object.entries(formDataItem)) {
			const [key, insideKey, id] = item[0].split("-");
			if (key === "food") {
				if (!dataPreparedItem.foods) {
					dataPreparedItem.foods = {};
					dataPreparedItem.foods[id] = {
						id: Number(id),
						[insideKey]:
							insideKey === "weight" ? Number(item[1]) : trimIfString(item[1]),
					};
				} else {
					dataPreparedItem.foods[id] = {
						id: Number(id),
						...dataPreparedItem.foods[id],
						[insideKey]:
							insideKey === "weight" ? Number(item[1]) : trimIfString(item[1]),
					};
				}
			} else {
				dataPreparedItem[key] = (item[1] as string).length
					? trimIfString(item[1])
					: undefined;
			}
		}
		dataPreparedItem.foods = Object.values(dataPreparedItem.foods);
		dataPreparedItem.search = `${dataPreparedItem.cnpj} ${dataPreparedItem.name} ${dataPreparedItem.phone} ${dataPreparedItem.address}`;
		dataPrepared.push(dataPreparedItem);
	}

	const { data, error } = await supabase.from("cityhalls").insert(dataPrepared);

	if (error) {
		return {
			error: {
				message: "Erro ao criar essas prefeituras",
			},
		};
	}

	revalidateTag("cityhalls");

	return {
		error: null,
		message: "Prefeituras criadas com sucesso!",
	};
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function handleCityHall(formData: FormData | Record<string, any>) {
	const supabase = createClient();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const dataPrepared = { emblem: "emblem.png" } as any;
	for (const item of formData.entries
		? formData.entries()
		: Object.entries(formData)) {
		const [key, insideKey, id] = item[0].split("-");
		if (key === "food") {
			if (!dataPrepared.foods) {
				dataPrepared.foods = {};
				dataPrepared.foods[id] = {
					id: Number(id),
					[insideKey]:
						insideKey === "weight"
							? Number(item[1])
							: insideKey === "value"
								? Number(item[1].replaceAll(/[R$.\s]/g, "").replace(",", ".")) *
									100
								: trimIfString(item[1]),
				};
			} else {
				dataPrepared.foods[id] = {
					id: Number(id),
					...dataPrepared.foods[id],
					[insideKey]:
						insideKey === "weight"
							? Number(item[1])
							: insideKey === "value"
								? Number(item[1].replaceAll(/[R$.\s]/g, "").replace(",", ".")) *
									100
								: trimIfString(item[1]),
				};
			}
		} else {
			dataPrepared[key] = (item[1] as string).length
				? trimIfString(item[1])
				: undefined;
		}
	}
	dataPrepared.foods = Object.values(dataPrepared.foods);
	dataPrepared.search = `${dataPrepared.cnpj} ${dataPrepared.name} ${dataPrepared.phone} ${dataPrepared.address}`;

	const { data, error } = await supabase
		.from("cityhalls")
		.upsert(dataPrepared)
		.select("id")
		.single();

	if (!data?.id || error) {
		return {
			error: {
				message: dataPrepared.id
					? "Erro ao atualizar essa prefeitura"
					: "Erro ao criar essa prefeitura",
			},
		};
	}

	revalidateTag("cityhalls");

	return {
		error: null,
		data: {
			id: data.id,
			bucket: "cityhall",
		},
		message: dataPrepared.id
			? "Prefeitura atualizada com sucesso!"
			: "Prefeitura criada com sucesso!",
		push: "/dashboard/prefeituras",
	};
}

export async function deleteCityHall(id: string) {
	const supabase = createClient();

	const { error } = await supabase.from("cityhalls").delete().eq("id", id);

	if (error) {
		return {
			error: {
				message: "Erro ao deletar essa prefeitura",
			},
		};
	}

	revalidateTag("cityhalls");

	return {
		error: null,
		message: "Prefeitura deletada com sucesso!",
		push: "/dashboard/prefeituras",
	};
}
