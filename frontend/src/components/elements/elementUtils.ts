import { ImageElement } from "./ImageElement";
import { CanvasElementData } from "../types";
import { getElementDefinition } from "./ElementRegistry";

//constructor
export const createDefaultElement = (
    type: string,
    x: number,
    y: number,
    canvasWidth: number,
    canvasHeight: number
  ): CanvasElementData => {

    const defaultText =
    type === "Button" ? "Button" :
    type === "Text" ? "Text" :
    "";

    return {
      type,
      x,
      y,
      text: defaultText,
      src: "",
      width: 100,
      height: 50,
      canvasWidth,
      canvasHeight,
      editing: false,
    }
  };

//helpers
export function getElementLabel(type: string): string {
  return getElementDefinition(type)?.label ?? "Unknown";
}

export function isImageElement(type: string) {
  return getElementDefinition(type) && type === ImageElement.label;
}
  