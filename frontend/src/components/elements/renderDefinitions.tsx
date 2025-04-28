import { TextElement } from "./TextElement";
import { ImageElement } from "./ImageElement";
import { ButtonElement } from "./ButtonElement";

//type defs
export type ElementProps = {
  src?: string;
  text?: string;
  width?: number;
  height?: number;
};

export const ELEMENT_DEFINITIONS = {
  Text: TextElement,
  Image: ImageElement,
  Button: ButtonElement,
} as const;

export type ElementType = keyof typeof ELEMENT_DEFINITIONS;

//helper functions
export function getElementDefinition(type: string) {
  if (type in ELEMENT_DEFINITIONS) {
    return ELEMENT_DEFINITIONS[type as ElementType];
  }
  return undefined;
}

export function getElementLabel(type: string) {
  if (type in ELEMENT_DEFINITIONS) {
    return ELEMENT_DEFINITIONS[type as ElementType].label;
  }
  return "Unknown";
}

export function isImageElement(type: string) {
  return type in ELEMENT_DEFINITIONS && type === ImageElement.label;
}
  