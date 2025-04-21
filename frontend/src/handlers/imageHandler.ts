import { ElementData } from "../components/types";
import { processImage } from "../utils/image";

export function handleImageFile(opts: {
    data: File | DataTransferItem | Blob,
    canvas: DOMRect,
    createElement: (e: ElementData) => void
}) {    
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

        img.src = src; // will trigger the onload function defined above
    };

    if (data instanceof DataTransferItem) {
        const file = data.getAsFile();
        if (file != null) {
            reader.readAsDataURL(file); 
        }
    }
    else if (data instanceof Blob) {
        reader.readAsDataURL(data);
    }
    else {
        reader.readAsDataURL(data);
    }
    
    reader.onerror = () => {
        console.error("Failed to read image file.");
    };
}
