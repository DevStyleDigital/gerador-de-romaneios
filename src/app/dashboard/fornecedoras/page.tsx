import { CopyId } from "@/components/copy-id";
import { Pagination } from "@/components/pagination";
import { Search } from "@/components/search";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
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
import { Ellipsis, TruckIcon } from "lucide-react";
import Image from "next/image";
import { handleDataPagination } from "../../../services/pagination";
import { DeleteCooperative } from "./components/delete-cooperative";
import { HandleCooperative } from "./components/handle-cooperative";

export default async function Page({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	const {
		data: cooperatives,
		lastPage,
		page,
		perPage,
		searchQuery,
		supabase,
	} = await handleDataPagination({
		searchParams,
		table: "cooperatives",
		tags: ["cooperatives"],
		bucket: "cooperative",
	});

	const lastTagData = await supabase
		.from("cooperatives")
		.select("id")
		.order("id", { ascending: false })
		.limit(1);
	const lastTag = lastTagData.data?.[0]?.id || 0;

	return (
		<Card className="overflow-auto">
			<CardHeader className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2" />
				<div className="flex max-md:flex-col items-center justify-between gap-4 w-full">
					<CardTitle>
						<div className="flex items-center gap-2">
							<TruckIcon className="h-6 w-6" />
							Fornecedoras
						</div>
					</CardTitle>
					<HandleCooperative lastTag={lastTag}>
						<DialogTrigger asChild>
							<Button variant="outline">Cadastrar Fornecedora</Button>
						</DialogTrigger>
					</HandleCooperative>
				</div>
				<Search defaultValue={searchParams.search} />
			</CardHeader>
			<CardContent className="p-0">
				<div className="border-t border-gray-200">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">#ID</TableHead>
								<TableHead className="w-[100px]">Emblema</TableHead>
								<TableHead className="min-w-[150px]">CNPJ</TableHead>
								<TableHead className="min-w-[150px]">Nome</TableHead>
								<TableHead>
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cooperatives?.map((cooperative) => (
								<TableRow key={cooperative.id}>
									<TableCell className="font-medium">
										#{cooperative.id.toString().padStart(4, "0")}
									</TableCell>
									<TableCell>
										<Image
											alt="Emblema"
											className="rounded-full"
											height={50}
											src={cooperative.emblem || "/placeholder.svg"}
											style={{
												aspectRatio: "50/50",
												objectFit: "cover",
											}}
											width={50}
										/>
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{cooperative.cnpj}
									</TableCell>
									<TableCell>{cooperative.name}</TableCell>
									<TableCell>
										<DeleteCooperative id={cooperative.id}>
											<HandleCooperative cooperative={cooperative}>
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
														<CopyId id={cooperative.id} />
														<DialogTrigger asChild>
															<DropdownMenuItem>Edit</DropdownMenuItem>
														</DialogTrigger>
														<AlertDialogTrigger asChild>
															<DropdownMenuItem variant="delete">
																Delete
															</DropdownMenuItem>
														</AlertDialogTrigger>
													</DropdownMenuContent>
												</DropdownMenu>
											</HandleCooperative>
										</DeleteCooperative>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{!cooperatives?.length && (
						<span className="flex items-center justify-center w-full text-muted-foreground p-6">
							Nenhuma fornecedora cadastrada...
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
