"use client";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import {
	Landmark,
	SchoolIcon,
	ShoppingCartIcon,
	TruckIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linkVariants = cva(
	"flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
	{
		variants: {
			variant: {
				default: "text-muted-foreground hover:text-accent-foreground",
				active: "bg-accent-foreground/10 text-accent-foreground",
			},
		},
	},
);

export const MainNav = ({ modal = false }) => {
	const pathname = usePathname();
	const Comp = modal
		? (props: { children: React.ReactNode }) => <SheetClose {...props} />
		: Slot;

	return (
		<nav className="grid items-start px-4 text-sm font-medium">
			<Comp>
				<Link
					className={cn(
						linkVariants({
							variant: pathname === "/dashboard" ? "active" : "default",
						}),
					)}
					href="/dashboard"
				>
					<ShoppingCartIcon className="h-4 w-4" />
					Romaneios
				</Link>
			</Comp>
			<Comp>
				<Link
					className={cn(
						linkVariants({
							variant: pathname === "/dashboard/escolas" ? "active" : "default",
						}),
					)}
					href="/dashboard/escolas"
				>
					<SchoolIcon className="h-4 w-4" />
					Escolas
				</Link>
			</Comp>
			<Comp>
				<Link
					className={cn(
						linkVariants({
							variant: pathname === "/dashboard/prefeituras" ? "active" : "default",
						}),
					)}
					href="/dashboard/prefeituras"
				>
					<Landmark className="h-4 w-4" />
					Prefeituras
				</Link>
			</Comp>
			<Comp>
				<Link
					className={cn(
						linkVariants({
							variant: pathname === "/dashboard/fornecedoras" ? "active" : "default",
						}),
					)}
					href="/dashboard/fornecedoras"
				>
					<TruckIcon className="h-4 w-4" />
					Fornecedoras
				</Link>
			</Comp>
		</nav>
	);
};
