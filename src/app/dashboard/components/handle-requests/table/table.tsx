"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { PaginationWithFunction } from "@/components/pagination";
import { Input } from "@/components/ui/input";
import type { RequestType } from "@/types/request";
import { RequestActions } from "./actions";

const getStatusClassName = (status: string) => {
  switch (status) {
    case "error":
      return "bg-red-500/20 border-red-500 hover:bg-red-500/40";
    case "warning":
      return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/40";
    default:
      return "";
  }
};

interface DataTableProps {
  columns: ColumnDef<RequestType>[];
  data: RequestType[];
}

export function DataTable({
  columns,
  data: initialData,
}: DataTableProps) {
  const [data, setData] = React.useState(initialData)
  const skipPageResetRef = React.useRef<boolean>(false);

  const updateData = (newData: RequestType[])  => {
    skipPageResetRef.current = true
    setData(newData)
  }
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  React.useEffect(() => {
    updateData(initialData);
  }, [initialData, updateData]);

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: !skipPageResetRef.current,
    autoResetExpanded: !skipPageResetRef.current,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  const pageCount = table.getPageCount();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between gap-4 max-md:justify-center p-4 pt-0">
        <Input
          placeholder="Pesquisar por escola..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm w-full"
        />

        <RequestActions />
      </div>
      <div className="border border-x-transparent overflow-x-auto">
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
                            header.getContext()
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={getStatusClassName(row.original.status)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <>
                    Comece criando uma fornecedora, uma prefeitura e as
                    escolas dessa prefeitura.
                    <br /> Depois baixe o CSV para iniciar clicando em "Baixar
                    CSV das escolas" mais acima.
                  </>
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
