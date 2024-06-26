import { createBrowserClient } from "@supabase/ssr";
import { Upload } from "tus-js-client";

export const createClient = () => {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL || "",
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
		{
			global: {
				fetch: (input, init) =>
					fetch(input, {
						...init,
					}),
			},
		},
	);
};

export async function uploadFile(
	bucket: string,
	filePath: string,
	file: File | Blob,
	opts: {
		upsert?: boolean;
		contentType?: string;
		access_token: string;
		onProgress?: (percentage: number) => void;
	},
): Promise<string> {
	return new Promise((resolve, reject) => {
		const upload = new Upload(file, {
			endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
			retryDelays: [0, 3000, 5000, 10000, 20000],
			headers: {
				authorization: `Bearer ${opts.access_token}`,
				apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
				"x-upsert": `${opts?.upsert ?? false}`,
			},
			uploadDataDuringCreation: true,
			removeFingerprintOnSuccess: true,
			metadata: {
				bucketName: bucket,
				objectName: filePath,
				contentType: opts?.contentType || "image/png",
				cacheControl: 3600,
			} as unknown as { [key: string]: string },
			chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
			onError: (error) => reject(error),
			onProgress: (bytesUploaded, bytesTotal) =>
				opts?.onProgress?.(bytesUploaded / bytesTotal),
			onSuccess: () => resolve(filePath),
		});

		upload.findPreviousUploads().then((previousUploads) => {
			if (previousUploads.length)
				upload.resumeFromPreviousUpload(previousUploads[0]);
			upload.start();
		});
	});
}
