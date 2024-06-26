import NotFoundImage from "@/assets/not-found.webp";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="lg:px-24 md:py-20 md:px-44 min-h-dvh px-4 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
			<div className="w-full xl:w-1/2 relative max-md:text-center">
				<div className="absolute top-1/2 px-[2%] -translate-y-1/2">
					<span className="text-[18vw] font-bold text-foreground/10 blur-md">
						404
					</span>
				</div>
				<div className="relative">
					<div>
						<div className="space-y-4">
							<h1 className="font-bold text-4xl">
								Parece que você encontrou a porta para o grande nada
							</h1>
							<p className="text-muted-foreground">
								Desculpe por isso! Por favor, visite nossa página inicial para
								chegar onde você precisa ir.
							</p>
							<Button asChild>
								<Link href="/">Leve-me até lá!</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="relative">
				<Image src={NotFoundImage} alt="" className="absolute top-0 blur-md" />
				<Image src={NotFoundImage} alt="" className="relative opacity-60" />
			</div>
		</div>
	);
}
