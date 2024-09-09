import { Combobox } from "@/components/comboboxes";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { RequestType } from "@/types/request";
import { cn } from "@/utils/cn";
import { AlertTriangleIcon } from "lucide-react";
import React from "react";
import { useRequests } from "../../contexts/resquests";
import {
	LOCAL_STORAGE_REQUEST,
	saveToLocalStorage,
} from "../../utils/loacal-storage";
import { Foods } from "./foods";

const Form = ({
	request,
	index,
	setOpen,
}: {
	request: RequestType;
	index: number;
	setOpen: (v: boolean) => void;
}) => {
	const { cityHalls, requests, setRequests } = useRequests();
	const [currentRequest, setCurrentRequest] = React.useState(
		structuredClone(request),
	);
	const [cityHallId, setCityHallId] = React.useState<string | undefined>(
		currentRequest.cityHallId,
	);

	function getSchools(chid: string | undefined) {
		return cityHalls.find((cityHall) => cityHall.id === chid)?.schools;
	}

	const [schools, setSchools] = React.useState(getSchools(cityHallId) || []);
	const [school, setSchool] = React.useState<string | undefined>(
		currentRequest.school.id,
	);

	function handleRequestErrorName() {
		setCurrentRequest((prevRequest) => {
			const newRequest = { ...prevRequest }; // Clone the current state
			if (newRequest.status !== "error") newRequest.status = "warning";
			if (!newRequest.issues.includes("name")) newRequest.issues.push("name");
			return newRequest;
		});
	}

	function handleRequestSuccessName() {
		setCurrentRequest((prevRequest) => {
			const newRequest = { ...prevRequest }; // Clone the current state
			newRequest.issues = newRequest.issues.includes("name")
				? newRequest.issues.filter((issue) => issue !== "name")
				: newRequest.issues;
			if (newRequest.issues.length === 0) newRequest.status = "success";
			return newRequest;
		});
	}

	return (
		<form
			onSubmit={(ev) => {
				ev.preventDefault();
				const inputInvalid = document.getElementById(
					"has-food-invalid-page",
				) as HTMLInputElement;
				if (
					currentRequest.foods.some((item) => {
						return (
							!item.cooperativeId ||
							(item.cityHallFoodId === "none" &&
								!item.price &&
								!item.weight &&
								!item.name?.length) ||
							!item.quantity
						);
					})
				) {
					inputInvalid.setCustomValidity(
						"Algumas páginas possuem alimentos sem algumas informações!",
					);
					inputInvalid.reportValidity();
					return;
				}

				inputInvalid.setCustomValidity("");

				setRequests((prev) => {
					currentRequest.issues = currentRequest.issues.includes("name")
						? ["name"]
						: [];
					currentRequest.status = "success";

					if (
						currentRequest.foods.some(
							({ issue }) => issue === "food-not-exists",
						)
					) {
						currentRequest.issues.push("food-not-exists");
					}
					if (currentRequest.foods.some(({ issue }) => issue === "food-name")) {
						currentRequest.issues.push("food-name");
					}
					if (
						currentRequest.issues.includes("name") ||
						currentRequest.issues.includes("food-name")
					) {
						currentRequest.status = "warning";
					}
					if (currentRequest.issues.includes("food-not-exists")) {
						currentRequest.status = "error";
					}

					currentRequest.totalValue = currentRequest.foods.reduce(
						(acc, item) => acc + (item.price || 0) * (item.quantity || 1),
						0,
					);
					currentRequest.totalWeight = currentRequest.foods.reduce(
						(acc, item) => acc + (item.weight || 0) * (item.quantity || 1),
						0,
					);

					if (!prev[index]) prev.unshift(currentRequest);
					else prev[index] = currentRequest;

					saveToLocalStorage(LOCAL_STORAGE_REQUEST, prev);
					return [...prev];
				});
				setOpen(false);
			}}
			className="flex flex-col w-full max-w-[calc(100vw-5rem)] max-h-full"
		>
			<DialogHeader>
				<DialogTitle>Editar Pedidos</DialogTitle>
				<DialogDescription>
					Altere as informações conforme o necessário
				</DialogDescription>
			</DialogHeader>
			<Separator className="mt-8" />
			<div className="w-full h-[70dvh] overflow-y-auto py-8 px-4">
				<div className="grid grid-cols-2 gap-x-4 gap-y-1">
					<Label htmlFor="cityhall_id">Prefeitura:</Label>
					<Label htmlFor="school">Escola:</Label>
					{!request.cityHallId.length ? (
						<Combobox
							data={cityHalls}
							label="prefeitura"
							id="cityhall_id"
							setValue={(id) => {
								if (!id) return;
								setCityHallId(id);
								setSchools(getSchools(id) || []);
								setSchool(undefined);

								currentRequest.school.default_csv_name = "";
								currentRequest.school.id = "";
								currentRequest.id = "";
								currentRequest.school.name = "";
								currentRequest.school.number = undefined;

								currentRequest.cityHallId = id;
								currentRequest.foods = currentRequest.foods.map((item) => ({
									...item,
									issue:
										(item.cityHallFoodId as string)?.split("?")[1] === id ||
										item.cityHallFoodId === "none"
											? null
											: "food-not-exists",
								}));
							}}
							value={cityHallId}
						/>
					) : (
						<Input
							value={
								cityHalls.find(({ id }) => currentRequest.cityHallId === id)
									?.name
							}
							className="opacity-50 pointer-events-none"
							readOnly
							tabIndex={-1}
						/>
					)}
					<Combobox
						data={schools}
						hiddenSelect={requests.map(({ school }) => school.id)}
						label="escola"
						id="school"
						setValue={(id) => {
							setSchool(id);
							const school = schools.find(
								(sch) => Number(sch.id) === Number(id),
							)!;
							currentRequest.school.default_csv_name = school.csv_name;
							currentRequest.school.id = school.id.toString();
							currentRequest.id = school.id.toString();
							currentRequest.school.name = school.name;
							currentRequest.school.number = school.number;

							if (
								currentRequest.school.csv_name.length &&
								school.csv_name !== currentRequest.school.default_csv_name
							) {
								handleRequestErrorName();
							} else handleRequestSuccessName();
						}}
						value={school}
					/>
				</div>
				<div className="flex gap-4 mt-4 items-end">
					<div className="w-full">
						<Label htmlFor="csv_name">CSV Name:</Label>
						<div className="relative w-full">
							<Input
								type="text"
								name="csv_name"
								id="csv_name"
								readOnly
								value={request.school.csv_name}
								placeholder="Nenhum fornecido"
								className={cn(
									currentRequest.issues.includes("name") && "border-yellow-400",
								)}
							/>
							<AlertTriangleIcon
								className={cn(
									"size-4 absolute text-muted-foreground bg-background right-4 top-1/2 -translate-y-1/2",
									currentRequest.issues.includes("name") && "text-yellow-400",
								)}
							/>
						</div>
					</div>
					{currentRequest.issues.includes("name") && (
						<Button
							type="button"
							variant="outline"
							onClick={handleRequestSuccessName}
							className="w-fit"
						>
							Liberar
						</Button>
					)}
				</div>
				<div className="flex gap-4 mt-4 items-end">
					<Label className="flex items-center gap-2">
						<input type="checkbox" onChange={(ev) =>  {
							setCurrentRequest((prevRequest) => {
								const newRequest = { ...prevRequest }; // Clone the current state
								newRequest.isReplacement = ev.target.checked;
								return newRequest;
							});
						}} />
						<span>Romaneio de Reposição</span>
					</Label>
				</div>
				<Foods request={currentRequest} setCurrentRequest={setCurrentRequest} />
			</div>
			<Separator className="mb-8" />
			<DialogFooter className="flex-row max-md:justify-center gap-4">
				<DialogClose asChild>
					<Button variant="outline">Cancelar</Button>
				</DialogClose>
				<Button type="submit">Salvar</Button>
			</DialogFooter>
		</form>
	);
};

export const TableActions = ({
	request,
	index,
	children,
}: {
	request: RequestType;
	index: number;
	children: React.ReactNode;
}) => {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{children}
			<DialogContent className="max-w-screen-2xl w-[calc(100vw-2rem)] h-[calc(100dvh-4rem)]">
				<Form request={request} index={index} setOpen={setOpen} />
			</DialogContent>
		</Dialog>
	);
};
