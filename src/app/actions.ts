"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/services/supabase/server";

export async function login(formData: FormData) {
	const supabase = createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error?.message === "Invalid login credentials")
		throw "E-mail e Senha Inválidos";

	if (error) {
		redirect("/");
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
}

export async function signOut() {
	const supabase = createClient();

	await supabase.auth.signOut();

	revalidatePath("/", "layout");
	redirect("/");
}
