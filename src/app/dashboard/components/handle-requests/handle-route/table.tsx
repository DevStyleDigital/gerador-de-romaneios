"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { PaginationWithFunction } from "@/components/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Data = { id: string; number: number; weight: number; name: string };
export const columns: ColumnDef<Data>[] = [
	{
		accessorKey: "number",
		header: "#Número",
		cell: ({ row }) => (
			<p className="capitalize">
				#{row.original.number?.toString().padStart(4, "0")}
			</p>
		),
	},
	{
		accessorKey: "name",
		header: "Nome da Escola",
		cell: ({ row }) => <p className="uppercase">{row.original.name}</p>,
	},
	{
		accessorKey: "weight",
		header: "Peso (Kg)",
		cell: ({ row }) => <p className="uppercase">~ {row.original.weight}</p>,
	},
];

export function TableSelect({
	data,
	onRowClick,
}: {
	data: Data[];
	onRowClick: (data: Data) => void;
}) {
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 5,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		state: { pagination },
	});

	const canPreviousPage = table.getCanPreviousPage();
	const canNextPage = table.getCanNextPage();
	const pageCount = table.getPageCount();

	return (
		<div className="w-full h-fit">
			<div className="border border-x-transparent overflow-x-auto h-full">
				<Table className="min-w-full h-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className={header.id === "id" ? "w-24" : ""}
										>
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
								<TableRow
									key={row.original.id}
									data-state={row.getIsSelected() && "selected"}
									className="cursor-pointer"
									onClick={() => onRowClick(row.original)}
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
							))
						) : (
							<TableRow className="h-full">
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhum item a mais na tabela...
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
