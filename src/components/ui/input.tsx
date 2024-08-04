"use client";
import { cn } from "@/utils/cn";
import * as React from "react";
import InputMask from "react-text-mask";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[error]:border-destructive",
					className,
				)}
				ref={ref}
				{...props}
				onChange={(ev) => {
					ev.target.removeAttribute("data-error");
					props.onChange?.(ev);
				}}
			/>
		);
	},
);
Input.displayName = "Input";

const MaskedInput = React.forwardRef<
	HTMLInputElement,
	InputProps & { mask: (string | RegExp)[] | string; showMask?: boolean }
>(({ mask, onChange, showMask = true, ...props }, ref) => {
	return (
		<InputMask
			mask={
				typeof mask === "string"
					? mask
							.split("'")
							.flatMap((t) =>
								t
									.split("r}")
									.map((r, i, arr) =>
										i === arr.length - 1 ? r : new RegExp(r),
									),
							)
					: mask
			}
			guide={showMask}
			{...props}
			render={(ref, inputProps) => (
				<Input
					ref={ref as (inputElement: HTMLInputElement) => void}
					{...inputProps}
					onChange={(ev) => {
						inputProps.onChange(ev);
						onChange?.(ev);
					}}
				/>
			)}
		/>
	);
});
MaskedInput.displayName = "MaskedInput";

export { Input, MaskedInput };
