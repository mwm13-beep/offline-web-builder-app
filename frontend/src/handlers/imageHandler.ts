import { ElementData } from "../components/types";
import { processImage } from "../utils/image";

export function handleImageFile(opts: {
    kind: "image",
    data: File,
    canvas: DOMRect,
    createElement: (e: ElementData) => void
}) {
    if (opts.kind !== "image") return;
    
    const { data, canvas, createElement } = opts;
    const reader = new FileReader();
    
    reader.onload = () => {
        const src = reader.result as string;
        const img = new Image();

        img.onload = () => {
        const { width, height } = processImage(img, canvas);
            const newElement: ElementData = {
            type: "img",
            x: canvas.left,
            y: canvas.top,
            width: width,
            height: height,
            src,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            };
            createElement(newElement);
        };

        img.src = src; // trigger the onload function defined above
    };

    reader.onerror = () => {
        console.error("Failed to read image file.");
    };

    reader.readAsDataURL(data);
}
