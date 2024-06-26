export async function imageConversion(
	file: File | string,
	{
		scale = 1,
		quality = 1,
		...opts
	}: {
		scale?: number;
		quality?: number;
		width?: number;
		height?: number;
		cWidth?: number;
		cHeight?: number;
		pixelRatio?: number;
		x?: number;
		y?: number;
	},
	convertType = "image/png",
): Promise<Blob> {
	return new Promise((res, rej) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const src = typeof file === "string" ? file : URL.createObjectURL(file);
		const image = new Image();
		image.src = src;

		image.onload = () => {
			canvas.width = opts.cWidth || image.width * scale;
			canvas.height = opts.cHeight || image.height * scale;

			if (typeof opts.pixelRatio === "number") {
				ctx?.scale(opts.pixelRatio, opts.pixelRatio);
				ctx?.save();
			}

			if (typeof opts.x === "number" && typeof opts.y === "number")
				ctx?.translate(opts.x, opts.y);

			if (opts.width && opts.height) {
				ctx?.drawImage(
					image,
					0,
					0,
					opts.width,
					opts.height,
					0,
					0,
					opts.width,
					opts.height,
				);
			} else ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

			canvas.toBlob(
				(blob) => {
					if (!blob) rej("Failed to convert image.");
					if (blob) res(blob);
				},
				convertType,
				quality,
			);
		};
	});
}
