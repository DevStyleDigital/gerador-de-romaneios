import { Pagination } from "@/components/pagination";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CityHall } from "@/types/city-hall";
import { Ellipsis, SchoolIcon } from "lucide-react";
import Link from "next/link";
import { handleDataPagination } from "../../../services/pagination";
import { CsvForm } from "./components/csv-form";
import { DeleteSchool } from "./components/delete-school";
import { DownloadCSV } from "./components/download-csv";
import { SearchContainer } from "./components/search";

export default async function Page({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	const {
		data: schools,
		lastPage,
		page,
		perPage,
		searchQuery,
		supabase,
	} = await handleDataPagination({
		searchParams,
		table: "schools",
		tags: ["schools", "cityhalls"],
		bucket: "school",
		filter: (client) => client.eq("cityhall_id", searchParams.prefeitura || ""),
	});
	const lastTagData = await supabase
		.from("schools")
		.select("id")
		.order("id", { ascending: false })
		.limit(1);
	const lastTag = lastTagData.data?.[0]?.id || 0;
	const cityHalls = (await supabase
		.from("cityhalls")
		.select("id, name")
		.then((res) => {
			if (!res.data || res.error) return [];
			return res.data;
		})) as CityHall[];

	return (
		<Card>
			<CardHeader className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2" />
				<div className="flex max-md:flex-col items-center justify-between gap-4 w-full">
					<CardTitle>
						<div className="flex items-center gap-2">
							<SchoolIcon className="h-6 w-6" />
							Escolas
						</div>
					</CardTitle>
					<div className="flex gap-4 flex-wrap items-center justify-center">
						<Button asChild>
							<Link href="/dashboard/escolas/adicionar">
								Cadastrar Nova Escola
							</Link>
						</Button>
						<DownloadCSV />
						<CsvForm lastTag={lastTag} />
					</div>
				</div>
				<div className="flex items-end justify-between w-full">
					<SearchContainer cityHalls={cityHalls} />
					{!!searchParams.prefeitura?.length && (
						<DeleteSchool id="all" cityHall={searchParams.prefeitura}>
							<AlertDialogTrigger asChild>
								<Button variant="destructive">Deletar Escolas</Button>
							</AlertDialogTrigger>
						</DeleteSchool>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="border-t border-gray-200">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">#Número</TableHead>
								<TableHead className="min-w-[150px]">Nome da Escola</TableHead>
								<TableHead className="hidden md:table-cell">Endereço</TableHead>
								<TableHead>
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{schools?.map((school) => (
								<TableRow key={school.id}>
									<TableCell className="font-medium">
										#{school.number.toString().padStart(4, "0")}
									</TableCell>
									<TableCell>{school.name}</TableCell>
									<TableCell className="hidden md:table-cell">
										{school.address}
									</TableCell>
									<TableCell>
										<DeleteSchool id={school.id}>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														aria-haspopup="true"
														size="icon"
														variant="ghost"
													>
														<Ellipsis className="h-4 w-4" />
														<span className="sr-only">
															Abrir/Fechar menu de ações
														</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Ações</DropdownMenuLabel>
													<Link href={`/dashboard/escolas/${school.id}`}>
														<DropdownMenuItem>Editar</DropdownMenuItem>
													</Link>
													<AlertDialogTrigger asChild>
														<DropdownMenuItem variant="delete">
															Deletar
														</DropdownMenuItem>
													</AlertDialogTrigger>
												</DropdownMenuContent>
											</DropdownMenu>
										</DeleteSchool>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{!schools?.length && (
						<span className="flex items-center justify-center w-full text-muted-foreground p-6">
							{!searchParams.prefeitura?.length
								? "Selecione uma prefeitura..."
								: "Nenhuma escola cadastrada..."}
						</span>
					)}
					<Pagination
						lastPage={lastPage}
						page={page}
						perPage={perPage}
						searchQuery={
							searchQuery +
							(searchParams.prefeitura?.length
								? `&prefeitura=${searchParams.prefeitura}`
								: "")
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
