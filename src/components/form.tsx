"use client";

import { createClient, uploadFile } from "@/services/supabase";
import { cn } from "@/utils/cn";
import { imageConversion } from "@/utils/image-conversion";
import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";
import React from "react";
import type { ButtonProps } from "./ui/button";
import { useToast } from "./ui/use-toast";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	action: (
		formData: any,
		additionalData?: FormContext["additionalData"],
	) => Promise<
		| { error: null; data?: any; message?: string; push?: string }
		| {
				error: { message: string; elements?: [string, string][] };
				push?: string;
		  }
	>;
}

interface FormContext {
	onSubmitFinish?: (type: "error" | "success", res?: any) => void;
	additionalData: any;
	loading: boolean;
	setLoading: (v: boolean) => void;
}

const FormContext = React.createContext<FormContext>({} as FormContext);
export const useForm = () => React.useContext(FormContext);

export const FormElem = React.forwardRef<HTMLFormElement, FormProps>(
	({ action, ...props }, ref) => {
		const supabase = createClient();
		const { toast } = useToast();
		const router = useRouter();
		const { additionalData, onSubmitFinish, setLoading } = useForm();

		return (
			<form
				action={async (formData) => {
					formData.delete("upload");
					const session = await supabase.auth.getSession();
					const access_token = session.data.session?.access_token;
					if (!access_token) {
						setLoading(false);
						onSubmitFinish?.("error");
						return toast({
							variant: "destructive",
							description:
								"Error de autenticação: recarregue a página e tente novamente",
						});
					}

					const res = await action(formData);
					if (res.error) {
						toast({ variant: "destructive", description: res.error.message });
						if (!res.error.elements) {
							setLoading(false);
							onSubmitFinish?.("error");
							return;
						}

						const elements = res.error.elements;
						for (let i = 0; i < elements.length; i++) {
							const element = document.getElementById(elements[1][0]);
							element?.tagName === "INPUT" &&
								element.setAttribute("data-error", elements[i][1]);
							i === 0 && element?.focus();
						}

						setLoading(false);
						onSubmitFinish?.("error");
						return;
					}

					if (res.data?.bucket && additionalData?.emblem) {
						const image = await imageConversion(additionalData.emblem as File, {
							scale: 1,
							quality: 1,
						}).catch(() => null);
						const imageRes = image
							? await uploadFile(
									res.data.bucket,
									`${res.data.id}/emblem.png`,
									image,
									{ access_token },
								).catch(() => null)
							: null;

						if (!imageRes)
							toast({
								variant: "destructive",
								description:
									"Error ao alterar o emblema. Tente novamente mais tarde!",
							});
					}

					res.message && toast({ description: res.message });
					res.push && router.push(res.push);
					onSubmitFinish?.("success", res.data);
					setLoading(false);
				}}
				ref={ref}
				{...props}
				onSubmit={(ev) => {
					setLoading(true);
					props.onSubmit?.(ev);
				}}
			/>
		);
	},
);

export const Form = React.forwardRef<
	HTMLFormElement,
	FormProps & {
		insetChildren?: boolean;
		onSubmitFinish?: (type: "error" | "success", res?: any) => void;
	}
>(({ children, onSubmitFinish, insetChildren = true, ...props }, ref) => {
	const [loading, setLoading] = React.useState(false);
	const additionalData = {};
	return (
		<FormContext.Provider
			value={{ additionalData, setLoading, loading, onSubmitFinish }}
		>
			<FormElem ref={ref} {...props}>
				{insetChildren && children}
			</FormElem>
			{!insetChildren && children}
		</FormContext.Provider>
	);
});

export const DisableFormControl = React.forwardRef<
	HTMLButtonElement,
	ButtonProps
>(({ className, ...props }, ref) => {
	const { loading } = useForm();
	const Comp = Slot as unknown as "button";
	return (
		<Comp
			{...props}
			disabled={loading}
			className={cn(
				className,
				loading && "pointer-events-none opacity-60 !cursor-not-allowed",
			)}
			ref={ref}
		/>
	);
});
