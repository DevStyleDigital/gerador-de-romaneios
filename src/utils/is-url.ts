import { z } from "zod";

export function isUrl(value: string) {
	return z.string().url().safeParse(value).success;
}
