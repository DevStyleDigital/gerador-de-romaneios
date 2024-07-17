import { WRatio, extract, ratio } from "fuzzball";

export function suggest(
  word: string,
  dictionary: string[],
  points = 80
): [string | undefined, number] {
  const matches = extract(
    word
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(),
    dictionary.map((v) =>
      v
        .normalize("NFD")
        // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
    ),
    {
      scorer: WRatio,
      processor: (item) => item.toLowerCase(),
      limit: 1,
    }
  );
  const bestMatch = matches[0];

  if (bestMatch[1] >= points) {
    return [bestMatch[0], bestMatch[2]];
  }

  return [undefined, -1];
}
