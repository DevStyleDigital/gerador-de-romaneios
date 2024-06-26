import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./services/supabase/middleware";

function redirect(request: NextRequest, pathname: string) {
	const url = request.nextUrl.clone();
	url.pathname = pathname;
	return NextResponse.redirect(url);
}
function rewrite(request: NextRequest, pathname: string) {
	const url = request.nextUrl.clone();
	url.pathname = pathname;
	return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-url-pathname", request.nextUrl.pathname);
	requestHeaders.set("x-url-host", request.nextUrl.host);

	const { supabase, response } = createClient(request, requestHeaders);

	const { data, error } = await supabase.auth.getUser();
	const isInvalidUser = error || !data?.user;

	if (request.nextUrl.pathname === "/" && !isInvalidUser)
		return redirect(request, "/dashboard");
	if (request.nextUrl.pathname.startsWith("/dashboard") && isInvalidUser)
		return rewrite(request, "/not-found");

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
