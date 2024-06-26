"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { type FileItem, handleUpload } from "@/services/upload-file";
import { cn } from "@/utils/cn";
import { UploadIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "./form";

export const EmblemCard = ({ emblem }: { emblem?: string }) => {
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
			<CardHeader>
				<CardTitle>Emblema da Prefeitura</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-2">
					<EmblemUpload emblem={emblem} />
				</div>
			</CardContent>
		</Card>
	);
};

export const EmblemUpload = ({
	emblem,
	className,
	form = "upsert",
}: {
	emblem?: string;
	className?: string;
	form?: "upsert" | null;
}) => {
	const { toast } = useToast();
	const [files, setFiles] = React.useState<(FileItem | string)[]>(
		emblem ? [emblem] : [],
	);
	const { additionalData } = useForm();

	const uploadOptions = {
		files,
		handleFiles: setFiles,
		toast,
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: not needed
	React.useEffect(() => {
		if (typeof files[0] !== "string") {
			additionalData.emblem = files[0];
		}
	}, [files]);

	return (
		<label
			onDragOver={(ev) => {
				ev.preventDefault();
			}}
			onDrop={(ev) => {
				ev.preventDefault();
				ev.stopPropagation();

				const file = ev.dataTransfer.files.item(0);
				if (file) handleUpload([file], 0, uploadOptions);
			}}
			className={cn(
				"flex aspect-square cursor-pointer hover:bg-accent w-full items-center justify-center rounded-md border border-dashed",
				className,
			)}
		>
			{files[0] ? (
				<Image
					alt="Emblema da Prefeitura"
					className="h-full aspect-square w-fit hover:opacity-95 rounded-md object-cover"
					height="300"
					src={
						typeof files[0] === "string"
							? files[0]
							: files[0]?.src || "/placeholder.svg"
					}
					width="300"
				/>
			) : (
				<UploadIcon className="h-4 w-4 text-muted-foreground" />
			)}
			<span className="sr-only">Enviar</span>
			<input
				type="file"
				name="upload"
				id="upload"
				accept="image/*"
				className="sr-only"
				onFocus={() => document.getElementById("upload-input")?.focus()}
				required={files.length === 0}
				onChange={(ev) => {
					const file = ev.target.files?.item(0);
					file && handleUpload([file], 0, uploadOptions);
					ev.target.value = "";
				}}
				form={form === null ? undefined : form}
			/>
		</label>
	);
};
