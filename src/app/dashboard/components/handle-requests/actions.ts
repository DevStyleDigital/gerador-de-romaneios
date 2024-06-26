"use server";
import { createClient } from "@/services/supabase/server";

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
	const cooperative = formData.get("cooperative_id");
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
			fornecedora: cooperative,
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
