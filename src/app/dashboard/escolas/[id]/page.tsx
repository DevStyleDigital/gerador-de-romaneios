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

import { Form } from "@/components/form";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { createClient } from "@/services/supabase/server";
import type { Cooperative } from "@/types/cooperative";
import Link from "next/link";
import { redirect } from "next/navigation";
import { handleSchool } from "../actions";
import { DeleteSchool } from "../components/delete-school";
import { CityHallSelect } from "./components/city-hall";
import { Comments } from "./components/comments";

export default async function Page({ params }: { params: { id: string } }) {
	const supabase = createClient(["schools", "cityhalls"]);
	const cityHalls = await supabase
		.from("cityhalls")
		.select("id, name")
		.then((res) => {
			if (!res.data || res.error) return [];
			return res.data;
		});
	const cooperatives = (await supabase
		.from("cooperatives")
		.select("id, name")
		.then((res) => {
			if (!res.data || res.error) return [];
			return res.data;
		})) as Cooperative[];

	const lastTagData = await supabase
		.from("schools")
		.select("id")
		.order("id", { ascending: false })
		.limit(1);
	const lastTag = lastTagData.data?.[0]?.id || 0;

	const school =
		params.id !== "adicionar"
			? await supabase
					.from("schools")
					.select("*")
					.eq("id", params.id)
					.single()
					.then(async (res) => {
						if (!res.data || res.error) return null;
						return res.data;
					})
			: null;
	const isCreate = params.id === "adicionar";

	if (!school && params.id !== "adicionar") redirect("/dashboard/escolas");

	return (
		<div className="flex flex-col sm:gap-4 sm:py-4">
			<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
				<Form
					insetChildren={false}
					action={handleSchool}
					className="sr-only"
					id="upsert"
				>
					<div className="mx-auto grid max-w-screen-2xl w-full flex-1 auto-rows-max gap-4">
						<input
							id="id"
							name="id"
							value={school?.id || (lastTag || 0) + 1}
							readOnly
							hidden
							form="upsert"
						/>
						<div className="flex items-center gap-4">
							<Button
								asChild
								variant="outline"
								size="icon"
								className="h-7 w-7"
								disabledByForm
							>
								<Link href="/dashboard/escolas">
									<ChevronLeft className="h-4 w-4" />
									<span className="sr-only">Voltar</span>
								</Link>
							</Button>
							<h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
								{isCreate ? "Criar Escola" : "Editar Escola"}
							</h1>
							<div className="hidden items-center gap-2 md:ml-auto md:flex">
								<Button disabledByForm variant="outline" size="sm" asChild>
									<Link href="/dashboard/escolas">Cancelar</Link>
								</Button>
								<Button disabledByForm type="submit" size="sm" form="upsert">
									{isCreate ? "Criar" : "Atualizar"} Escola
								</Button>
							</div>
						</div>
						<div className="grid gap-4 xl:grid-cols-2 2xl:gap-8">
							<div className="grid auto-rows-max items-start gap-4 2xl:gap-8">
								<Card x-chunk="dashboard-07-chunk-0">
									<CardHeader>
										<CardTitle>Detalhes da Escola</CardTitle>
										<CardDescription>
											Forneça as informações da escola que aparecerão no
											romaneio.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-3">
											<CityHallSelect
												cityHall={school.cityhall_id}
												cityHalls={cityHalls}
											/>
											<div className="grid md:grid-cols-2 gap-2">
												<div className="grid gap-1">
													<Label htmlFor="name">Nome*</Label>
													<Input
														id="name"
														name="name"
														type="text"
														required
														form="upsert"
														className="w-full"
														pattern=".{3,}"
														defaultValue={school?.name}
													/>
												</div>
												<div className="grid w-full items-center gap-1">
													<Label htmlFor="csv_name">Apelido*</Label>
													<Input
														required
														id="csv_name"
														name="csv_name"
														form="upsert"
														defaultValue={school?.csv_name}
														placeholder="Nome utilizado pela prefeitura"
													/>
												</div>
											</div>
											<div className="grid md:grid-cols-2 gap-2">
												<div className="grid w-full items-center gap-1">
													<Label htmlFor="pos">Posição de Retorno*</Label>
													<Input
														required
														type="number"
														id="pos"
														name="pos"
														form="upsert"
														defaultValue={school?.pos}
														placeholder="10"
													/>
												</div>
												<div className="grid w-full items-center gap-1">
													<Label htmlFor="pos">Numero da escola*</Label>
													<Input
														required
														type="number"
														id="number"
														name="number"
														form="upsert"
														defaultValue={school?.number}
														placeholder="10"
													/>
												</div>
											</div>
											<div className="grid gap-1">
												<Label htmlFor="phone">Celular</Label>
												<MaskedInput
													id="phone"
													name="phone"
													className="w-full"
													form="upsert"
													mask="('\dr}\dr})' '9'\dr}\dr}\dr}\dr}-'\dr}\dr}\dr}\dr}"
													pattern="\(\d{2}\) 9\d{4}-\d{4}"
													placeholder="(15) 91111-1111"
													defaultValue={school?.phone}
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
													defaultValue={school?.address}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
							<div className="grid auto-rows-max items-start gap-4 2xl:gap-8">
								<Card>
									<CardHeader>
										<CardTitle>Observações</CardTitle>
										<CardDescription>
											Essas observações irão aparecer no romaneio correspondente
											a cada fornecedora.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Comments
											comments={school.comments}
											cooperatives={cooperatives}
										/>
									</CardContent>
								</Card>
								{school && (
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
											<DeleteSchool id={school.id}>
												<AlertDialogTrigger asChild>
													<Button
														disabledByForm
														size="sm"
														variant="destructive"
													>
														Excluir Prefeitura
													</Button>
												</AlertDialogTrigger>
											</DeleteSchool>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
						<div className="flex items-center justify-center gap-2 md:hidden">
							<Button disabledByForm variant="outline" size="sm" asChild>
								<Link href="/dashboard/escolas">Cancelar</Link>
							</Button>
							<Button disabledByForm type="submit" size="sm" form="upsert">
								{isCreate ? "Criar" : "Atualizar"} Escola
							</Button>
						</div>
					</div>
				</Form>
			</main>
		</div>
	);
}
