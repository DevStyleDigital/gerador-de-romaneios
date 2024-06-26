import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getCategories = cache(
	async (
		ctx: SupabaseClient<any, "public", any>,
		pagination: { skip: number; take: number },
	) => {
		const { data, error } = await ctx
			.from("categories")
			.select("*")
			.range(pagination.skip, pagination.take);

		if (error) return [];
		return data;
	},
);

export const getBanners = cache(
	async (ctx: SupabaseClient<any, "public", any>, page: string) => {
		const { data, error } = await ctx
			.from("banners")
			.select("*")
			.eq("page", page);

		if (error) return [];
		return data;
	},
);

export type Product<
	T extends
		| string
		| {
				id: string;
				name: string;
		  } = {
		id: string;
		name: string;
	},
> = {
	id: string;
	name: string;
	status: string;
	images: string[];
	created_at: string;
	uri_id: string;
	description: string;
	search: string;
	keywords?: string;
	features: [];
	category: T;
};
type Filter = ReturnType<
	ReturnType<SupabaseClient<any, "public", any>["from"]>["select"]
>;

export const getProducts = cache(
	async (
		ctx: SupabaseClient<any, "public", any>,
		options: {
			skip: number;
			take: number;
			search?: string;
			get?: string;
			filters?: (ctx: Filter) => Filter;
		},
	) => {
		const format = !options.get;
		const get =
			"id,name,created_at,status,category,images,categories(name)" as "*";
		let products = ctx
			.from("products")
			.select((options.get as typeof get) || get);

		if (options.search) {
			products = products.ilike("search", `%${options.search}%`);
		}

		if (options.filters) {
			products = options.filters(products);
		}

		const { data, error } = await products.range(options.skip, options.take);

		if (error || !data) return [];
		return !format
			? (data as Product[])
			: (data.map(({ images, category, categories, ...item }) => ({
					...item,
					category: {
						id: category,
						name: (categories as unknown as { name: string }).name,
					},
					images: images.map(
						(id: string) =>
							ctx.storage.from("products").getPublicUrl(`${item.id}/${id}.png`)
								.data.publicUrl,
					),
				})) as Product[]);
	},
);

export const getProduct = cache(
	async (
		ctx: SupabaseClient<any, "public", any>,
		id?: string,
		uri_id?: string,
		options?: {
			filters?: (ctx: Filter) => Filter;
		},
	) => {
		let product = id
			? ctx.from("products").select("*").eq("id", id)
			: ctx.from("products").select("*").eq("uri_id", uri_id);

		if (options?.filters) {
			product = options.filters(product);
		}

		const { data, error } = await product.single();

		if (error) return null;
		return data as Product;
	},
);
