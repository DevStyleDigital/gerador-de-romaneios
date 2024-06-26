"use client";
import { DisableFormControl, Form } from "@/components/form";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { deleteCooperative } from "../actions";

export const DeleteCooperative = ({
	id,
	children,
}: { id: string; children: React.ReactNode }) => {
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	const handleDelete = async () => {
		const res = await deleteCooperative(id);
		setIsDialogOpen(false);
		return res;
	};

	return (
		<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			{children}
			<AlertDialogContent className="p-0 gap-0">
				<Form
					insetChildren={false}
					action={handleDelete}
					className="sr-only"
					id="delete"
				>
					<AlertDialogHeader className="border-b p-6">
						<AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
						<AlertDialogDescription>
							Essa ação não pode ser desfeita. Isto irá permanentemente excluir
							essa fornecedora de nosso servidores.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="bg-muted p-6">
						<Label htmlFor="delete">
							Digite <b>Deletar essa fornecedora</b> abaixo para deletar*
						</Label>
						<Input
							id="delete"
							required
							name="delete"
							form="delete"
							placeholder="Digite aqui.."
							pattern="\s*Deletar essa fornecedora\s*"
						/>
					</div>
					<AlertDialogFooter className="border-t p-6">
						<DisableFormControl>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>
						</DisableFormControl>
						<Button
							type="submit"
							form="delete"
							variant="destructive"
							disabledByForm
						>
							Prosseguir com a exclusão
						</Button>
					</AlertDialogFooter>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
};
