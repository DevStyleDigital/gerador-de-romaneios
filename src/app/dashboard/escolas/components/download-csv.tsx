"use client";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export const DownloadCSV = () => {
	const handleDownloadCSV = (csvData: string) => {
		const blob = new Blob([csvData], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "modelo-cadastro-escolas.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Button
			variant="outline"
			onClick={() =>
				handleDownloadCSV(
					"nome,apelido,endereco,telefone,numero,posicao no pedido,id prefeitura",
				)
			}
		>
			Baixar modelo CSV <DownloadIcon className="size-4 ml-4" />
		</Button>
	);
};
