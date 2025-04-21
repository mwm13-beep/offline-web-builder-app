import { ElementData } from "../components/types";
import { handleImageFile } from "./imageHandler";
import { handleTextContent } from "./textHandler";

type HandlerFunction = (opts: {
    data: any;
    canvas: DOMRect;
    createElement: (e: ElementData) => void;
  }) => void;
  
const handlerMap: Record<string, HandlerFunction> = {
    image: handleImageFile,
    text: handleTextContent,
    // add more handlers here later
};
  
// overloads
function getDataType(input: File): string;
function getDataType(input: DataTransferItem): string;
function getDataType(input: string): string;
function getDataType(input: Blob): string;

// implementation
function getDataType(input: any): string {
  // string check
  if (typeof input === "string") return "text";
  
  // DataTransferItem
  if (typeof DataTransferItem !== "undefined" && input instanceof DataTransferItem) {
      if (input.type.startsWith("text/")) return "text";
      if (input.type.startsWith("image/")) return "image";
  }

  // File
  if (input instanceof File) {
      if (input.type.startsWith("image/")) return "image";
  }

  // Blob (used in navigator.clipboard.read())
  if (input instanceof Blob) {
    if (input.type.startsWith("image/")) return "image";
    if (input.type.startsWith("text/")) return "text";
  }

  return ""
}

export function handler(opts: {
  data: any;
  canvas: DOMRect;
  createElement: (e: ElementData) => void;
}): boolean {
  const { data, canvas, createElement } = opts;

  const kind = getDataType(data);
  const handlerFunc = handlerMap[kind];

  if (handlerFunc) {
    handlerFunc({ data, canvas, createElement });
    return true;
  }

  console.warn(`❌ No handler found for type: ${kind}`);
  return false;
}
  
