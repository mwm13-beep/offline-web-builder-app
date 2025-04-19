import { ElementData  } from "../components/types";

export function handleTextContent(opts: {
    kind: "text",
    data: string,
    canvas: DOMRect,
    createElement: (e: ElementData) => void
}) {
    if (opts.kind !== "text") return;
    const { data, canvas, createElement } = opts;

    const maxW = canvas.width * 0.5;
    const maxH = canvas.height * 0.5;
  
    const newElement: ElementData = {
        type: "p",
        x: canvas.left,
        y: canvas.top,
        text: data, // add the text to the element
        src: "",
        width: maxW,
        height: maxH,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
    };
  
    createElement(newElement);
  }
  