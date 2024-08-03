"use server";

import { createClient } from "@/services/supabase/server";
import { revalidateTag } from "next/cache";

export async function handleSchools(
	formData: Record<string, string | number | undefined>[],
) {
	const supabase = createClient();
	const dataPrepared: Record<string, string | number | undefined>[] = [];

	for (const formDataItem of formData) {
		let dataPreparedItem: Record<string, string | number | undefined> = {
			search: "",
		};
		for (const item of Object.entries(formDataItem)) {
			const [key] = item[0].split("-");
			dataPreparedItem = {
				...dataPreparedItem,
				[key]: (item[1] as string).toString().length ? item[1] : undefined,
			};
		}
		dataPreparedItem.search = `${dataPreparedItem.id
			?.toString()
			.padStart(4, "0")} ${dataPreparedItem.name} ${dataPreparedItem.phone} ${
			dataPreparedItem.route
		} ${dataPreparedItem.address}`;
		dataPreparedItem.pos = Number(dataPreparedItem.pos);

		dataPrepared.push(dataPreparedItem);
	}

	const { error } = await supabase.from("schools").insert(dataPrepared);

	if (error) {
		return {
			error: {
				message: "Erro ao criar essas escolas",
			},
		};
	}

	revalidateTag("schools");

	return {
		error: null,
		message: "Escolas cadastradas!",
	};
}

export async function handleSchool(
	formData:
		| FormData
		| Record<string, string | object | null | number | undefined>,
) {
	const supabase = createClient();
	const dataPrepared = {} as Record<
		string,
		string | number | null | undefined | object
	>;
	for (const item of typeof formData.entries === "function"
		? formData.entries()
		: Object.entries(formData)) {
		const [key] = item[0].split("-");
		dataPrepared[key] = (item[1] as string).toString().length
			? typeof item[1] === "string"
				? item[1].trim()
				: item[1]
			: undefined;
	}
	dataPrepared.search = `${dataPrepared.id?.toString().padStart(4, "0")} ${
		dataPrepared.name
	} ${dataPrepared.phone} ${dataPrepared.route} ${dataPrepared.address}`;

	dataPrepared.pos = Number(dataPrepared.pos);
	try {
		dataPrepared.comments = JSON.parse(dataPrepared.comments as string);
	} catch {
		dataPrepared.comments = null;
	}

	const { data, error } = await supabase
		.from("schools")
		.upsert(dataPrepared)
		.select("id")
		.single();

	if (!data?.id || error) {
		return {
			error: {
				message: dataPrepared.id
					? "Erro ao atualizar essa escola"
					: "Erro ao criar essa escola",
			},
		};
	}

	revalidateTag("schools");

	return {
		error: null,
		data: {
			id: data.id,
		},
		message: dataPrepared.id
			? "Escola atualizada com sucesso!"
			: "Escola criada com sucesso!",
		push: `/dashboard/escolas?prefeitura=${dataPrepared.cityhall_id}`,
	};
}

export async function deleteSchool(id: string, cityHall?: string) {
	const supabase = createClient();

	const { error } =
		id === "all" && cityHall?.length
			? await supabase.from("schools").delete().eq("cityhall_id", cityHall)
			: await supabase.from("schools").delete().eq("id", id);

	if (error) {
		return {
			error: {
				message: "Erro ao deletar essa escola",
			},
		};
	}

	revalidateTag("schools");

	return {
		error: null,
		message: "Escola deletada com sucesso!",
		// push: "/dashboard/escolas",
	};
}
