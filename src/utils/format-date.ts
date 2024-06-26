export function formatDate(date?: string) {
	return new Date(date || Date.now()).toLocaleDateString("pt-BR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hourCycle: "h24",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}
