import sanitizeHtml from "sanitize-html";

export function sanitizeHTML(html: string) {
	return sanitizeHtml(html, {
		allowedTags: ["br"],
	});
}
