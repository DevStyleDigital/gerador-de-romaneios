import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input, MaskedInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EmblemCard } from "@/components/emblem-card";
import { Form } from "@/components/form";
import {
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { createClient } from "@/services/supabase/server";
import { isUrl } from "@/utils/is-url";
import Link from "next/link";
import { redirect } from "next/navigation";
import { handleCityHall } from "../actions";
import { DeleteCityHall } from "../components/delete-city-hall";
import { FoodCard } from "./components/food-card";

export default async function Page({ params }: { params: { id: string } }) {
	const supabase = createClient();
	const cityHall =
		params.id !== "adicionar"
			? await supabase
					.from("cityhalls")
					.select("*")
					.eq("id", params.id)
					.single()
					.then(async (res) => {
						if (!res.data || res.error) return null;
						res.data.emblem = isUrl(res.data.emblem)
							? res.data.emblem
							: (
									await supabase.storage
										.from("cityhall")
										.createSignedUrl(
											`${res.data.id}/${res.data.emblem}`,
											60 * 5,
										)
								).data?.signedUrl || null;
						return res.data;
					})
			: null;
	const isCreate = params.id  === "adicionar";

	if (!cityHall && params.id !== "adicionar") redirect("/dashboard/prefeituras");

	return (
		<div className="flex flex-col sm:gap-4 sm:py-4">
			<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
				<Form
					insetChildren={false}
					action={handleCityHall}
					className="sr-only"
					id="upsert"
				>
					<div className="mx-auto grid max-w-screen-2xl w-full flex-1 auto-rows-max gap-4">
						<input
							id="id"
							name="id"
							form="upsert"
							value={cityHall?.id}
							readOnly
							hidden
						/>
						<div className="flex items-center gap-4">
							<Button
								asChild
								variant="outline"
								size="icon"
								className="h-7 w-7"
								disabledByForm
							>
								<Link href="/dashboard/prefeituras">
									<ChevronLeft className="h-4 w-4" />
									<span className="sr-only">Voltar</span>
								</Link>
							</Button>
							<h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
								{isCreate ? "Criar Prefeitura" : "Editar Prefeitura"}
							</h1>
							<div className="hidden items-center gap-2 md:ml-auto md:flex">
								<Button disabledByForm variant="outline" size="sm" asChild>
									<Link href="/dashboard/prefeituras">Cancelar</Link>
								</Button>
								<Button disabledByForm type="submit" size="sm" form="upsert">
									{isCreate ? "Criar" : "Atualizar"} Prefeitura
								</Button>
							</div>
						</div>
						<div className="grid gap-4 xl:grid-cols-[1fr_250px] 2xl:grid-cols-3 2xl:gap-8">
							<div className="grid auto-rows-max items-start gap-4 2xl:col-span-2 2xl:gap-8">
								<Card x-chunk="dashboard-07-chunk-0">
									<CardHeader>
										<CardTitle>Detalhes da Prefeitura</CardTitle>
										<CardDescription>
											Forneça as informações da prefeitura que aparecerão no
											romaneio.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-3">
											<div className="grid gap-1">
												<Label htmlFor="name">Nome*</Label>
												<Input
													id="name"
													name="name"
													type="text"
													required
													form="upsert"
													className="w-full"
													pattern="Prefeitura Municipal de .{3,}"
													defaultValue={
														cityHall?.name || "Prefeitura Municipal de "
													}
												/>
											</div>
											<div className="grid gap-1">
												<Label htmlFor="cnpj">CNPJ*</Label>
												<MaskedInput
													id="cnpj"
													name="cnpj"
													required
													form="upsert"
													className="w-full"
													mask="\dr}\dr}.'\dr}\dr}\dr}.'\dr}\dr}\dr}/'\dr}\dr}\dr}\dr}-'\dr}\dr}"
													pattern="\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}"
													placeholder="00.000.000/0000-00"
													defaultValue={cityHall?.cnpj}
												/>
											</div>
											<div className="grid gap-1">
												<Label htmlFor="phone">Telefone*</Label>
												<MaskedInput
													id="phone"
													name="phone"
													required
													className="w-full"
													form="upsert"
													mask="('\dr}\dr})' '\dr}\dr}\dr}\dr}-'\dr}\dr}\dr}\dr}"
													pattern="\(\d{2}\) \d{4}-\d{4}"
													placeholder="(15) 1111-1111"
													defaultValue={cityHall?.phone}
												/>
											</div>
											<div className="grid gap-1">
												<Label htmlFor="address">Endereço*</Label>
												<Input
													id="address"
													name="address"
													required
													form="upsert"
													className="w-full"
													placeholder="Rua, Nº, Bairro"
													defaultValue={cityHall?.address}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
								<FoodCard foods={cityHall?.foods} />
							</div>
							<div className="grid auto-rows-max items-start gap-4 2xl:gap-8">
								<EmblemCard emblem={cityHall?.emblem} />
								{cityHall && (
									<Card className="border-destructive">
										<CardHeader>
											<CardTitle>Excluir Prefeitura</CardTitle>
											<CardDescription>
												Ao excluir uma prefeitura você exclui todas as escolas
												cadastradas nela.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div />
											<DeleteCityHall id={params.id}>
												<AlertDialogTrigger asChild>
													<Button
														disabledByForm
														size="sm"
														variant="destructive"
													>
														Excluir Prefeitura
													</Button>
												</AlertDialogTrigger>
											</DeleteCityHall>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
						<div className="flex items-center justify-center gap-2 md:hidden">
							<Button disabledByForm variant="outline" size="sm" asChild>
								<Link href="/dashboard/prefeituras">Cancelar</Link>
							</Button>
							<Button disabledByForm type="submit" size="sm" form="upsert">
								{isCreate ? "Criar" : "Atualizar"} Prefeitura
							</Button>
						</div>
					</div>
				</Form>
			</main>
		</div>
	);
}
