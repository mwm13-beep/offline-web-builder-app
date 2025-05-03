import { CanvasElementData } from "../components/types";
import { handleImageFile } from "./imageHandler";
import { handleTextContent } from "./textHandler";
import { TYPE_MAPPINGS } from "../components/elements/mimeToElementMappings";

type HandlerFunction = (opts: {
    data: any;
    canvas: DOMRect;
    createElement: (e: CanvasElementData) => void;
  }) => void;
  
  const handlerMap: Record<string, HandlerFunction> = {};

  handlerMap[TYPE_MAPPINGS["text/"]] = handleTextContent;
  handlerMap[TYPE_MAPPINGS["image/"]] = handleImageFile;
  
  // add more handlers here later
  
  
// overloads
function getDataType(input: File): string;
function getDataType(input: DataTransferItem): string;
function getDataType(input: string): string;
function getDataType(input: Blob): string;

function getDataType(input: any): string {
  if (typeof input === "string") return TYPE_MAPPINGS["text/"];

  if (typeof DataTransferItem !== "undefined" && input instanceof DataTransferItem) {
    for (const prefix in TYPE_MAPPINGS) {
      if (input.type.startsWith(prefix)) {
        return TYPE_MAPPINGS[prefix];
      }
    }
  }

  if (input instanceof File || input instanceof Blob) {
    for (const prefix in TYPE_MAPPINGS) {
      if (input.type.startsWith(prefix)) {
        return TYPE_MAPPINGS[prefix];
      }
    }
  }

  return "";
}

export function handler(opts: {
  data: any;
  canvas: DOMRect;
  createElement: (e: CanvasElementData) => void;
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
  
