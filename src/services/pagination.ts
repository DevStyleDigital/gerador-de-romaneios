import { createClient } from "@/services/supabase/server";
import { isUrl } from "@/utils/is-url";

export const handleDataPagination = async (options: {
	searchParams: Record<string, string>;
	tags: string[];
	table: string;
	bucket: string;
	filter?: (client: any) => any;
}) => {
	const supabase = createClient(options.tags);
	let dataPrepare = supabase.from(options.table).select("*");
	let totalPrepare = supabase.from(options.table).select("count");
	const [page, perPage, searchQuery] = [
		options.searchParams.page?.length ? Number(options.searchParams.page) : 0,
		options.searchParams.per_page?.length
			? Number(options.searchParams.per_page)
			: 10,
		options.searchParams.search?.length
			? `&search=${options.searchParams.search}`
			: "",
	];

	if (options.searchParams.search?.length) {
		dataPrepare = dataPrepare.ilike(
			"search",
			`%${options.searchParams.search}%`,
		);
		totalPrepare = totalPrepare.ilike(
			"search",
			`%${options.searchParams.search}%`,
		);
	}

	if (options.filter) {
		dataPrepare = options.filter(dataPrepare).order("name");
		totalPrepare = options.filter(totalPrepare);
	}

	const total = await totalPrepare.then((res) => {
		if (!res.data?.[0]?.count || res.error) return 0;
		return res.data[0].count;
	});

	const data = await dataPrepare
		.range(perPage * page, perPage * page + perPage - 1)
		.then((res) => {
			if (!res.data || res.error) return null;
			return Promise.all(
				res.data.map(async ({ id, emblem, ...rest }) => {
					return {
						id,
						emblem: isUrl(emblem)
							? emblem
							: (
									await supabase.storage
										.from(options.bucket)
										.createSignedUrl(`${id}/${emblem}`, 60 * 5)
								).data?.signedUrl || null,
						...rest,
					};
				}),
			);
		});
	const lastPage = Math.ceil(total / perPage) - 1;

	return {
		data,
		lastPage: lastPage <= 0 ? 0 : lastPage,
		total,
		page,
		perPage,
		searchQuery,
		supabase,
	};
};
