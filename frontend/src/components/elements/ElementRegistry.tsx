import { ElementDefinition } from "./elementTypes";

const elementDefinitions: Record<string, ElementDefinition> = {};

export function registerElement(type: string, definition: ElementDefinition) {
  elementDefinitions[type] = definition;
}

export function getElementDefinition(type: string): ElementDefinition | undefined {
  return elementDefinitions[type];
}

export function getAllElementDefinitions(): Record<string, ElementDefinition> {
  return { ...elementDefinitions }; // shallow clone to prevent accidental mutation
}