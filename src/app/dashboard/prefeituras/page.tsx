import { Pagination } from "@/components/pagination";
import { Search } from "@/components/search";
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
import { handleDataPagination } from "@/services/pagination";
import { Ellipsis, Landmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CopyId } from "./components/copy-id";
import { CsvForm } from "./components/csv-form";
import { DeleteCityHall } from "./components/delete-city-hall";

export default async function Page({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	const {
		data: cityHalls,
		lastPage,
		page,
		perPage,
		searchQuery,
	} = await handleDataPagination({
		searchParams,
		table: "cityhalls",
		tags: ["cityhalls"],
		bucket: "cityhall",
	});

	return (
		<Card>
			<CardHeader className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2" />
				<div className="flex max-md:flex-col items-center justify-between gap-4 w-full">
					<CardTitle>
						<div className="flex items-center gap-2">
							<Landmark className="h-6 w-6" />
							Prefeituras
						</div>
					</CardTitle>
					<div className="flex gap-4 flex-wrap items-center justify-center">
						<Button asChild>
							<Link href="/dashboard/prefeituras/adicionar">
								Cadastrar Prefeitura
							</Link>
						</Button>
						<CsvForm />
					</div>
				</div>
				<Search defaultValue={searchParams.search} />
			</CardHeader>
			<CardContent className="p-0">
				<div className="border-t border-gray-200">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Emblema</TableHead>
								<TableHead className="min-w-[150px] max-md:hidden">
									CNPJ
								</TableHead>
								<TableHead className="min-w-[150px]">Nome</TableHead>
								<TableHead>
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cityHalls?.map((cityHall) => (
								<TableRow key={cityHall.id}>
									<TableCell>
										<Image
											alt="Emblema"
											className="rounded-full"
											height={50}
											src={cityHall.emblem || "/placeholder.svg"}
											style={{
												aspectRatio: "50/50",
												objectFit: "cover",
											}}
											width={50}
										/>
									</TableCell>
									<TableCell className="max-md:hidden">
										{cityHall.cnpj}
									</TableCell>
									<TableCell>{cityHall.name}</TableCell>
									<TableCell>
										<DeleteCityHall id={cityHall.id}>
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
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<CopyId id={cityHall.id} />
													<DropdownMenuItem asChild>
														<Link
															href={`/dashboard/prefeituras/${cityHall.id}`}
														>
															Edit
														</Link>
													</DropdownMenuItem>
													<AlertDialogTrigger asChild>
														<DropdownMenuItem variant="delete">
															Delete
														</DropdownMenuItem>
													</AlertDialogTrigger>
												</DropdownMenuContent>
											</DropdownMenu>
										</DeleteCityHall>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{!cityHalls?.length && (
						<span className="flex items-center justify-center w-full text-muted-foreground p-6">
							Nenhuma prefeitura cadastrada...
						</span>
					)}
					<Pagination
						lastPage={lastPage}
						page={page}
						perPage={perPage}
						searchQuery={searchQuery}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
