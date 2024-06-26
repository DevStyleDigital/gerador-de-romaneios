import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
	PaginationContent,
	PaginationItem,
	Pagination as PaginationRoot,
} from "./ui/pagination";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

export const PaginationWithFunction = ({
	canPreviousPage,
	canNextPage,
	previousPage,
	nextPage,
	gotoPage,
	pageCount,
}: {
	canPreviousPage: boolean;
	canNextPage: boolean;
	previousPage: () => void;
	nextPage: () => void;
	gotoPage: (page: number) => void;
	pageCount: number;
}) => {
	return (
		<div className="flex items-center space-x-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipContent>Go to first page</TooltipContent>
					<TooltipTrigger asChild>
						<Button
							onClick={() => gotoPage(0)}
							disabled={!canPreviousPage}
							aria-label="Go to first page"
							variant="outline"
							size="icon"
						>
							<ChevronsLeftIcon className="size-4" aria-hidden="true" />
						</Button>
					</TooltipTrigger>
				</Tooltip>
				<Tooltip>
					<TooltipContent>Go to previous page</TooltipContent>
					<TooltipTrigger asChild>
						<Button
							onClick={previousPage}
							disabled={!canPreviousPage}
							aria-label="Go to previous page"
							variant="outline"
							size="icon"
						>
							<ChevronLeftIcon className="size-4" aria-hidden="true" />
						</Button>
					</TooltipTrigger>
				</Tooltip>
				<Tooltip>
					<TooltipContent>Go to next page</TooltipContent>
					<TooltipTrigger asChild>
						<Button
							onClick={nextPage}
							disabled={!canNextPage}
							aria-label="Go to next page"
							variant="outline"
							size="icon"
						>
							<ChevronRightIcon className="size-4" aria-hidden="true" />
						</Button>
					</TooltipTrigger>
				</Tooltip>
				<Tooltip>
					<TooltipContent>Go to last page</TooltipContent>
					<TooltipTrigger asChild>
						<Button
							onClick={() => gotoPage(pageCount - 1)}
							disabled={!canNextPage}
							aria-label="Go to last page"
							variant="outline"
							size="icon"
						>
							<ChevronsRightIcon className="size-4" aria-hidden="true" />
						</Button>
					</TooltipTrigger>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export const Pagination = ({
	page,
	perPage,
	lastPage,
	searchQuery,
}: {
	page: number;
	perPage: number;
	lastPage: number;
	searchQuery: string;
}) => {
	return (
		<PaginationRoot>
			<PaginationContent className="p-6">
				<PaginationItem>
					<TooltipProvider>
						<Tooltip>
							<TooltipContent>Ir para primeira página</TooltipContent>
							<TooltipTrigger asChild>
								<Button
									asChild
									aria-label="Ir para primeira página"
									disabled={page === 0}
									variant="outline"
									size="icon"
								>
									<Link
										href={{
											query: `page=0&per_page=${perPage}${searchQuery}`,
										}}
									>
										<ChevronsLeftIcon className="size-4" aria-hidden="true" />
									</Link>
								</Button>
							</TooltipTrigger>
						</Tooltip>
					</TooltipProvider>
				</PaginationItem>
				<PaginationItem>
					<TooltipProvider>
						<Tooltip>
							<TooltipContent>Ir para página anterior</TooltipContent>
							<TooltipTrigger asChild>
								<Button
									asChild
									disabled={page === 0}
									aria-label="Ir para página anterior"
									variant="outline"
									size="icon"
								>
									<Link
										href={{
											query: `page=${
												page - 1
											}&per_page=${perPage}${searchQuery}`,
										}}
									>
										<ChevronLeftIcon className="size-4" aria-hidden="true" />
									</Link>
								</Button>
							</TooltipTrigger>
						</Tooltip>
					</TooltipProvider>
				</PaginationItem>
				<PaginationItem>
					<TooltipProvider>
						<Tooltip>
							<TooltipContent>Ir para proxima página</TooltipContent>
							<TooltipTrigger asChild>
								<Button
									asChild
									disabled={page === lastPage || lastPage <= 0}
									aria-label="Ir para proxima página"
									variant="outline"
									size="icon"
								>
									<Link
										href={{
											query: `page=${
												page + 1
											}&per_page=${perPage}${searchQuery}`,
										}}
									>
										<ChevronRightIcon className="size-4" aria-hidden="true" />
									</Link>
								</Button>
							</TooltipTrigger>
						</Tooltip>
					</TooltipProvider>
				</PaginationItem>
				<PaginationItem>
					<TooltipProvider>
						<Tooltip>
							<TooltipContent>Ir para ultima página</TooltipContent>
							<TooltipTrigger asChild>
								<Button
									asChild
									disabled={page === lastPage || lastPage <= 0}
									aria-label="Ir para ultima página"
									variant="outline"
									size="icon"
								>
									<Link
										href={{
											query: `page=${lastPage}&per_page=${perPage}${searchQuery}`,
										}}
									>
										<ChevronsRightIcon className="size-4" aria-hidden="true" />
									</Link>
								</Button>
							</TooltipTrigger>
						</Tooltip>
					</TooltipProvider>
				</PaginationItem>
			</PaginationContent>
		</PaginationRoot>
	);
};
