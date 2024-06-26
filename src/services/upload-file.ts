import { uploadFile } from "@/services/supabase";
import { v4 as uuid } from "uuid";
import { imageConversion } from "../utils/image-conversion";

export type FileItem = File & { id?: string; src?: string };

export function isFileTypeAccepted(accept: string, fileType: string) {
	if (accept.includes("*/*")) return true;

	const fileTypeFormatted = fileType.replace("jpg", "jpeg");
	const acceptTypes = accept.split(",").map((type) => type.trim());

	for (const type of acceptTypes) {
		if (type === fileTypeFormatted) return true;
		if (type.endsWith("*") && type.startsWith(fileTypeFormatted.split("/")[0]))
			return true;
		if (type.endsWith(fileTypeFormatted.split("/")[1])) return true;
	}
	return false;
}

export function handleUpload(
	newFiles: File[],
	multipleOrIndex: boolean | number,
	options: {
		files: (FileItem | string)[];
		toast: (opts: { title: string; description: string }) => void;
		handleFiles: React.Dispatch<React.SetStateAction<(FileItem | string)[]>>;
		onNewFilesUploaded?: (index: number | null, files: FileItem[]) => void;
	},
) {
	const isIndex = typeof multipleOrIndex === "number";

	if (options.files.length >= 10 && !isIndex)
		return options.toast({
			title: "Opa!",
			description: "Você só pode adicionar até 10 imagens.",
		});

	const filesMax = newFiles as FileItem[];

	const filesMaxFiltered =
		"image/*" &&
		filesMax.filter((file: File) =>
			isFileTypeAccepted(
				"image/*",
				file.type.length ? file.type : `unknown/${file.name.split(".")[1]}`,
			),
		);

	filesMaxFiltered.splice(10 - options.files.length + (isIndex ? 1 : 0));

	if (filesMax?.length) {
		const newFilesMax = (
			(isIndex ? false : multipleOrIndex)
				? filesMaxFiltered || filesMax
				: [filesMaxFiltered[0] || filesMax[0]]
		).map((file) => {
			file.id = uuid();
			file.src = URL.createObjectURL(file);
			return file;
		});

		options.onNewFilesUploaded?.(isIndex ? multipleOrIndex : null, newFilesMax);
		options.handleFiles((prev) => {
			if (isIndex) {
				const newPrev = [...prev];
				newPrev[multipleOrIndex] = newFilesMax[0];

				return newPrev;
			}

			return prev.concat(newFilesMax);
		});
	}
}

export async function handleUploadImages(
	bucket: string,
	id: string,
	files: (FileItem | string)[],
	options: {
		access_token?: string;
		toast: (opts: {
			title: string;
			description: string;
			variant?: "default" | "destructive" | null | undefined;
		}) => void;
		handleUploadPercentage: React.Dispatch<React.SetStateAction<number>>;
	},
) {
	if (!options.access_token) {
		options.toast({
			variant: "destructive",
			title: "Ops!",
			description: "Ocorreu um erro ao salvar seu produto.",
		});
		return;
	}

	return Promise.all(
		files.map(async (file) => {
			if (typeof file === "string") return true;

			const imageWebp = await imageConversion(file, {
				quality: 1,
				scale: 0.75,
			});

			const path = await uploadFile(bucket, `${id}/${file.id}.png`, imageWebp, {
				upsert: true,
				contentType: "image/png",
				access_token: options.access_token || "",
				onProgress: options.handleUploadPercentage,
			})
				.then((path) => path)
				.catch(() => null);

			if (!path) {
				return false;
			}

			return true;
		}),
	);
}
