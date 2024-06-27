"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { PaginationWithFunction } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { RequestType } from "@/types/request";
import { PlusCircle } from "lucide-react";
import React from "react";
import { FoodProvider } from "./food-context";

const getStatusClassName = (status: string | null) => {
	switch (status) {
		case "food-not-exists":
			return "bg-red-500/20 border-red-500 hover:bg-red-500/40";
		case "food-name":
			return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/40";
		default:
			return "";
	}
};

interface DataTableProps {
	columns: ColumnDef<RequestType["foods"][number]>[];
	data: RequestType["foods"];
	request: RequestType;
	onClickAddNewFood: () => void;
}

export function DataTable({
	columns,
	data,
	request,
	onClickAddNewFood,
}: DataTableProps) {
	const table = useReactTable({
		data: [...data],
		columns,
		autoResetPageIndex: false,
		autoResetExpanded: false,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const canPreviousPage = table.getCanPreviousPage();
	const canNextPage = table.getCanNextPage();
	const pageCount = table.getPageCount();

	return (
		<div className="w-full">
			<div className="p-4 pt-0">
				<Button type="button" onClick={onClickAddNewFood} variant="outline">
					<PlusCircle className="size-4 mr-4" /> Adicionar Novo Alimento
				</Button>
			</div>
			<div className="border border-x-transparent max-w-full">
				<Table className="min-w-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<FoodProvider request={request} defaultFood={row.original}>
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className={getStatusClassName(row.original.issue)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								</FoodProvider>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhum pedido encontrado..
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 p-4">
				<PaginationWithFunction
					canPreviousPage={canPreviousPage}
					canNextPage={canNextPage}
					previousPage={table.previousPage}
					nextPage={table.nextPage}
					gotoPage={table.setPageIndex}
					pageCount={pageCount}
				/>
			</div>
		</div>
	);
}
