import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, Package2Icon, Settings, User2Icon } from "lucide-react";
import Link from "next/link";
import { signOut } from "../actions";
import { MainNav } from "./components/main-nav";
import { PageTitle } from "./components/page-title";

const Sidebar = ({ className = "", modal = false }) => (
	<aside
		className={`flex flex-col gap-2 lg:sticky lg:top-0 lg:h-screen w-full bg-background border-l border ${className}`}
	>
		<div className="flex h-[60px] items-center px-6">
			<Link className="flex items-center gap-2 font-semibold" href="/dashboard">
				<Package2Icon className="h-6 w-6" />
				<span>Painel de Controle</span>
			</Link>
		</div>
		<div className="flex-1">
			<MainNav modal={modal} />
		</div>
	</aside>
);

const Header = () => (
	<header className="flex h-14 sticky z-[49] top-0 lg:h-[60px] items-center gap-4 border-border border-y bg-card px-6 lg:max-w-[calc(100vw-1.5rem)]">
		<div>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						size="icon"
						variant="outline"
						className="cursor-pointer lg:hidden flex-shrink-0"
					>
						<Menu className="w-4 h-4" />
						<span className="sr-only">Abrir/Fechar Navegação</span>
					</Button>
				</SheetTrigger>
				<SheetContent className="lg:hidden top-14 w-screen h-fit p-0 border-none">
					<Sidebar modal className="!w-full pb-4 border-t-0" />
				</SheetContent>
			</Sheet>
		</div>
		<Link href="/dashboard">
			<Package2Icon className="h-6 w-6" />
			<span className="sr-only">Início</span>
		</Link>
		/
		<PageTitle />
		<div className="flex flex-1 items-end justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<ModeToggle />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="outline">
						<User2Icon className="w-4 h-4" />
						<span className="sr-only">Abrir/Fechar menu do usuário</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="/dashboard/configuracao">
							Configurações
							<DropdownMenuShortcut>
								<Settings className="w-4 h-4 ml-8" />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<form action={signOut} id="signOut" />
					<DropdownMenuItem asChild>
						<button type="submit" form="signOut" className="w-full">
							Sair
							<DropdownMenuShortcut>
								<LogOut className="w-4 h-4 ml-8" />
							</DropdownMenuShortcut>
						</button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</header>
);

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div key="1" className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
			<Sidebar className="hidden lg:flex" />
			<div className="flex flex-col">
				<Header />
				<main className="py-16 grid gap-16 sm:px-8 px-4">{children}</main>
			</div>
		</div>
	);
}
