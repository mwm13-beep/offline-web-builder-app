import { getElementDefinition } from "./elements/ElementRegistry"; 

export const getContextMenuItems = (type: string, props: any) => {
  const definition = getElementDefinition(type);
  return definition?.getContextMenuItems?.(props) ?? [];
};
