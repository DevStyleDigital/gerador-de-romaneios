"use client";
import { EmblemUpload } from "@/components/emblem-card";
import { Form } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input, MaskedInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cooperative } from "@/types/cooperative";
import React from "react";
import { handleCooperative } from "../actions";

export const HandleCooperative = ({
	cooperative,
	lastTag,
	children,
}: {
	children: React.ReactNode;
	cooperative?: Cooperative;
	lastTag?: number;
}) => {
	const [open, setOpen] = React.useState(false);
	const [isCPF, setIsCPF] = React.useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		setIsCPF(inputValue.length === 11);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{children}
			<DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[calc(100%-4rem)]">
				<Form
					onSubmitFinish={(type) => {
						if (type === "success") setOpen(false);
					}}
					action={handleCooperative}
				>
					<input
						id="id"
						name="id"
						value={cooperative?.id || (lastTag || 0) + 1}
						readOnly
						hidden
					/>
					<DialogHeader>
						<DialogTitle>
							{cooperative ? "Atualizar" : "Cadastrar nova"} fornecedora
						</DialogTitle>
						<DialogDescription>
							Forneça os dados da {cooperative ? "" : "nova "}fornecedora.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-1 mb-6">
							<Label htmlFor="upload">Emblema*</Label>
							<EmblemUpload
								form={null}
								emblem={cooperative?.emblem}
								className="h-44 w-full !aspect-auto p-2"
								required={false}
							/>
						</div>
						<div className="grid gap-1">
							<Label htmlFor="cnpj">CPF/CNPJ*</Label>
							<MaskedInput
								id="cnpj"
								name="cnpj"
								required
								className="w-full"
								mask={isCPF ? "999.999.999-99" : "99.999.999/9999-99"}
								pattern={isCPF ? "\d{3}\.\d{3}\.\d{3}-\d{2}" : "\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}"}
								placeholder={isCPF ? "000.000.000-00" : "00.000.000/0000-00"}
								defaultValue={cooperative?.cnpj}
								onChange={handleInputChange}
							/>
						</div>
						<div className="grid gap-1">
							<Label htmlFor="phone">Celular*</Label>
							<MaskedInput
								id="phone"
								name="phone"
								required
								className="w-full"
								mask="('\dr}\dr})' '9'\dr}\dr}\dr}\dr}-'\dr}\dr}\dr}\dr}"
								pattern="\(\d{2}\) 9\d{4}-\d{4}"
								placeholder="(15) 91111-1111"
								defaultValue={cooperative?.phone}
							/>
						</div>
						<div className="grid w-full items-center gap-2">
							<Label htmlFor="name">Nome*</Label>
							<Input
								required
								id="name"
								name="name"
								placeholder="Fornecedora 1"
								defaultValue={cooperative?.name}
							/>
						</div>
						<div className="grid w-full items-center gap-2">
							<Label htmlFor="address">Endereço*</Label>
							<Input
								required
								id="address"
								name="address"
								placeholder="Rua, Número, Bairro"
								defaultValue={cooperative?.address}
							/>
						</div>
						<div className="grid w-full items-center gap-2">
							<Label htmlFor="city">Cidade*</Label>
							<Input
								required
								id="city"
								name="city"
								placeholder="Sorocaba"
								defaultValue={cooperative?.city}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button disabledByForm type="submit">
							Cadastrar
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
