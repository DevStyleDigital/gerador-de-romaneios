import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UploadIcon } from "lucide-react";
import Papa from "papaparse";
import React from "react";
import type { Toast } from "./ui/use-toast";

interface CSVProps {
	onBeforeCSVLoad?: (data: any) => Promise<any>;
	onCSVLoad: (
		data: { item: any; i: number; arr: any[]; defaultData: any },
		withIssues: { line: number }[],
	) => Promise<any>;
	keys: string[];
	action?: (data: any) => Promise<any>;
	onLoadFinish?: (data: any) => void;
}

export async function handleCSV(
	data: any,
	{
		keys,
		onCSVLoad,
		action,
		onBeforeCSVLoad,
		onLoadFinish,
		setProgress,
		toast,
	}: CSVProps & {
		setProgress: (v: number | undefined) => void;
		toast: (props: Toast) => void;
	},
) {
	const dataTest = JSON.stringify(Array.isArray(data) ? data[0] : {});
	const newData = onBeforeCSVLoad ? await onBeforeCSVLoad(data) : data;

	if (
		!newData ||
		!Array.isArray(newData) ||
		!newData?.length ||
		!keys.every((key) => dataTest.includes(key))
	) {
		toast({
			description:
				"Erro ao ler o seu CSV. Verifique o arquivo e tente novamente!",
			variant: "destructive",
		});
		setProgress(undefined);
		return;
	}

	const withIssues: {
		line: number;
	}[] = [];

	const dataFormatted = await Promise.all(
		newData.map(
			async (item, i, arr) =>
				await onCSVLoad({ item, i, arr, defaultData: data }, withIssues),
		),
	);

	if (action) {
		// let itemsReady = 0;
		try {
			const res = await action(dataFormatted);
			if (res.error) {
				toast({
					description: res.error.message,
					variant: "destructive",
				});
			}
		} finally {
			// itemsReady += 1;
			// setProgress(
			//   Math.round((itemsReady / dataFormatted.length) * 100)
			// );
		}
	}

	onLoadFinish?.(dataFormatted);

	if (withIssues.length)
		toast({
			description: `As linhas a seguir possuem algum problema e não puderam ser cadastradas: ${withIssues.reduce(
				(acc, item, i) =>
					`${acc}${item.line}${withIssues.length - 1 === i ? "" : ", "}`,
				"",
			)}. Verifique-as e tente cadastra-las novamente!`,
		});
	setProgress(undefined);
}

export const CSVForm = ({
	disabled,
	...props
}: CSVProps & { disabled?: boolean }) => {
	const { toast } = useToast();
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const [progress, setProgress] = React.useState<number>();

	return (
		<>
			<Button
				asChild
				variant="outline"
				disabled={disabled || typeof progress === "number"}
				className="cursor-pointer"
			>
				{progress ? (
					<span>{progress}%</span>
				) : (
					<label htmlFor="load-csv">
						Carregar dados <span className="ml-2 italic">.csv</span> <UploadIcon className="ml-4 w-4 h-4" />
					</label>
				)}
			</Button>
			<input
				type="file"
				accept=".csv"
				id="load-csv"
				name="load-csv"
				hidden
				ref={inputFileRef}
				onChange={async (e) => {
					if (!inputFileRef.current) return;

					const files = e.target.files;
					if (!files) {
						inputFileRef.current.value = "";
						return;
					}

					setProgress(0);

					const data = await new Promise((resolve) => {
						Papa.parse(files[0], {
							header: true,
							skipEmptyLines: true,
							complete: (result: any) => {
								resolve(result.data);
							},
						});
					})
						.then((r) => r)
						.catch(() => null);

					inputFileRef.current.value = "";
					await handleCSV(data, { ...props, toast, setProgress });
				}}
			/>
		</>
	);
};
