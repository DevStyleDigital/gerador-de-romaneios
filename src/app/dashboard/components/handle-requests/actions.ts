"use server";
import { createClient } from "@/services/supabase/server";
import { revalidateTag } from "next/cache";

function convertJsonToCsv(items: any[]) {
	if (items.length === 0) return "";

	const headers = Object.keys(items[0]);
	const csvRows = items.map((item) =>
		headers
			.map((header) => {
				const value = item[header];
				return typeof value === "object" && value !== null
					? JSON.stringify(value)
					: String(value);
			})
			.join(","),
	);

	return [headers.join(","), ...csvRows].join("\r\n");
}

export async function generateCSVSchools(formData: FormData) {
	const id = formData.get("cityhall_id");
	const cooperativeId = formData.get("cooperative_id");
	const cooperativeName = formData.get("cooperative_name");
	const supabase = createClient(["schools"]);

	const { data, error } = await supabase
		.from("schools")
		.select("*")
		.eq("cityhall_id", id)
		.order("pos");

	if (error || !data) {
		return {
			error: {
				message:
					"Houve um erro ao gerar o csv das escolas. Tente novamente mais tarde!",
			},
		};
	}

	const csvData = convertJsonToCsv(
		data.map((school) => ({
			id: school.id,
			fornecedora: `${cooperativeId} ${cooperativeName || ""}`,
			apelido: school.csv_name,
		})),
	);

	return {
		data: csvData,
		error: null,
	};
}

export async function getSchool(id: string) {
	const supabase = createClient(["schools"]);

	const { data, error } = await supabase
		.from("schools")
		.select("*, cityhalls(*)")
		.eq("id", id)
		.single();

	if (!data || error) return null;
	return data;
}

export async function updateSchoolsComments(updates: any[]) {
	const supabase = createClient(["schools"]);
	await supabase.from("schools").upsert(updates);
	revalidateTag("schools");
	return true;
}

export async function getCooperative(id: string) {
	const supabase = createClient(["cooperatives"]);

	const { data, error } = await supabase
		.from("cooperatives")
		.select("*")
		.eq("id", id)
		.single();

	if (!data || error) return null;
	return data;
}

export async function getSchools(ids: string[]) {
	const supabase = createClient(["schools"]);

	const { data, error } = await supabase
		.from("schools")
		.select("*, cityhalls(*)")
		.in("id", ids);

	if (!data || error) return null;
	return data;
}

export const getSchoolsByCityHall = async (cityHall: string) => {
	const supabase = createClient(["schools"]);

	const { data, error } = await supabase
		.from("schools")
		.select("*")
		.eq("cityhall_id", cityHall);

	if (!data || error) return null;
	return data;
};
