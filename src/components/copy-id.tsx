"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const CopyId = ({ id }: { id: string }) => {
	const handleCopy = () => {
		navigator.clipboard.writeText(id).then(
			() => {
				console.log("ID copied to clipboard");
			},
			(err) => {
				console.error("Failed to copy ID: ", err);
			},
		);
	};

	return <DropdownMenuItem onClick={handleCopy}>Copiar ID</DropdownMenuItem>;
};
