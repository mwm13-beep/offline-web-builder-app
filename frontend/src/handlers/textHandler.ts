import { ElementData  } from "../components/types";

export function handleTextContent(opts: {
  data: string | DataTransferItem | Blob,
  canvas: DOMRect,
  createElement: (e: ElementData) => void
}) {
  const { data, canvas, createElement } = opts;
  const maxW = canvas.width * 0.5;
  const maxH = canvas.height * 0.5;

  const create = (text: string) => {
      const newElement: ElementData = {
        type: "p",
        x: canvas.left,
        y: canvas.top,
        text,
        src: "",
        width: maxW,
        height: maxH,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      };
      createElement(newElement);
    };
  
  if (typeof data === "string") {
    create(data);
  } else if (data instanceof DataTransferItem) {
    data.getAsString((text) => create(text));
  } else if (data instanceof Blob) {
    data.text().then((text) => {
      if (typeof text === "string" && text.trim() !== "") {
        create(text);
      }
    }).catch((err) => {
      console.error("Failed to read text from Blob:", err);
    });
  }
}
  