"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const PageTitle = () => {
	const pathname = usePathname();

	return (
		<div className="max-w-full w-full truncate">
			<span className="font-normal text-lg text-muted-foreground">
				{pathname
					.replace("/dashboard/", "")
					.replace("/dashboard", "Romaneios")
					.split("/")
					.map((path, i, arr) => (
						<span className="inline-flex items-center" key={i.toString()}>
							<Link
								className="text-base hover:text-foreground truncate"
								href={`${pathname
									.split("/")
									.splice(0, i + 3)
									.join("/")}`}
							>
								{path}
							</Link>
							{i < arr.length - 1 && <span className="mx-3">/</span>}
						</span>
					))}
			</span>
		</div>
	);
};
