"use client";
import { Combobox } from "@/components/comboboxes";
import { Form } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DownloadIcon } from "lucide-react";
import React from "react";
import { generateCSVSchools } from "../actions";
import { useRequests } from "../contexts/resquests";

export const GenerateRequestsCsvTemplate = () => {
	const { cityHalls, cooperatives } = useRequests();
	const [open, setOpen] = React.useState(false);
	const [cityHall, setCityHall] = React.useState<string | undefined>();
	const [cooperative, setCooperative] = React.useState<string | undefined>();

	const handleDownloadCSV = (csvData: string) => {
		const blob = new Blob([csvData], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "escolas.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
				setCityHall(undefined);
			}}
		>
			<DialogTrigger asChild>
				<Button variant="outline">
					Baixar Modelo de Pedidos <span className="italic ml-2">.csv</span>
					<DownloadIcon className="ml-4 w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-full w-fit">
				<Form
					onSubmitFinish={(type, res) => {
						if (type === "error") return setOpen(false);
						handleDownloadCSV(res);
						setOpen(false);
					}}
					action={generateCSVSchools}
				>
					<DialogHeader>
						<DialogTitle>Baixar Modelo de Pedidos</DialogTitle>
						<DialogDescription>
							Para gerar um csv com as escolas e montar o seu pedido.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4 my-8">
						<div className="grid w-full items-center gap-2">
							<Label htmlFor="city-hall">Selecione uma prefeitura*</Label>
							<Combobox
								data={cityHalls}
								id="cityhall_id"
								label="prefeitura"
								setValue={setCityHall}
								value={cityHall}
							/>
						</div>
						<div className="grid w-full items-center gap-2">
							<Label htmlFor="city-hall">Selecione uma fornecedora*</Label>
							<Combobox
								data={cooperatives}
								id="cooperative_id"
								label="fornecedora"
								setValue={setCooperative}
								value={cooperative}
							/>
							<input
								type="text"
								hidden
								id="cooperative_name"
								name="cooperative_name"
								value={
									cooperatives
										.find(({ id }) => id.toString() === cooperative)
										?.name?.split(/-|\s|_/g)[0]
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button disabledByForm type="submit">
							Gerar CSV com as Escolas
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
