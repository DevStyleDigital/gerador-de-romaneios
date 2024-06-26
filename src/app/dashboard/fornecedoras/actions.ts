"use server";

import { createClient } from "@/services/supabase/server";
import { revalidateTag } from "next/cache";

export async function handleCooperative(
	formData: FormData | Record<string, any>,
) {
	const supabase = createClient();
	const dataPrepared = { emblem: "emblem.png" } as any;
	for (const item of formData.entries
		? formData.entries()
		: Object.entries(formData)) {
		const [key] = item[0].split("-");
		dataPrepared[key] = (item[1] as string).toString().length
			? typeof item[1] === "string"
				? item[1].trim()
				: item[1]
			: undefined;
	}
	dataPrepared.search = `${dataPrepared.id.toString().padStart(4, "0")} ${
		dataPrepared.name
	} ${dataPrepared.phone} ${dataPrepared.address} ${dataPrepared.city} ${
		dataPrepared.cnpj
	}`;

	const { data, error } = await supabase
		.from("cooperatives")
		.upsert(dataPrepared)
		.select("id")
		.single();

	if (!data?.id || error) {
		return {
			error: {
				message: dataPrepared.id
					? "Erro ao atualizar essa fornecedora"
					: "Erro ao criar essa fornecedora",
			},
		};
	}

	revalidateTag("cooperatives");

	return {
		error: null,
		data: {
			id: data.id,
			bucket: "cooperative",
		},
		message: dataPrepared.id
			? "Fornecedora atualizada com sucesso!"
			: "Fornecedora criada com sucesso!",
		push: "/dashboard/fornecedoras",
	};
}

export async function deleteCooperative(id: string) {
	const supabase = createClient();

	const { error } = await supabase.from("cooperatives").delete().eq("id", id);

	if (error) {
		return {
			error: {
				message: "Erro ao deletar essa fornecedora",
			},
		};
	}

	revalidateTag("cooperatives");

	return {
		error: null,
		message: "Fornecedora deletada com sucesso!",
		push: "/dashboard/fornecedoras",
	};
}
