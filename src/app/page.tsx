"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { login } from "./actions";

export default function Page() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	return (
		<div className="w-full lg:grid lg:min-h-[600px] xl:min-h-[800px]">
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[350px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold">Admin</h1>
					</div>
					<form
						action={async (formData) => {
							setIsLoading(true);
							try {
								await login(formData).then((r) => {
									if (r) throw r;
								});
							} catch (e) {
								toast({
									title: "Ops! Encontramos um Erro.",
									description: e as any,
									variant: "destructive",
								});
							}
							setIsLoading(false);
						}}
						className="grid gap-4"
					>
						<div className="grid gap-2">
							<label htmlFor="email">Email</label>
							<Input
								id="email"
								type="email"
								name="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<label htmlFor="password">Password</label>
							<Input
								id="password"
								type="password"
								name="password"
								placeholder="****"
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? <LoaderIcon className="animate-spin" /> : "Login"}
						</Button>

						<Separator className="bg-border" />

						<span className="text-muted-foreground text-sm text-center">
							Made by{" "}
							<Link
								className="underline underline-offset-2"
								href="https://devstyle.com.br"
							>
								DevStyle
							</Link>
						</span>
					</form>
				</div>
			</div>
		</div>
	);
}
