import { WRatio, extract, ratio } from "fuzzball";

export function suggest(
	word: string,
	dictionary: string[],
	points = 80,
): [string | undefined, number][] {
	const matches = extract(word, dictionary, {
		scorer: WRatio,
		processor: (item) => item.toLowerCase(),
		limit: 1,
	});

	return matches.map((bestMatch) => {
		if (bestMatch[1] >= points) {
			return [bestMatch[0], bestMatch[2]];
		}

		return [undefined, -1];
	});
}
