import { JSX } from "react";
import { ContextMenuItem } from "../types";

export type RenderableElementProps = {
    src?: string;
    text?: string;
    width?: number;
    height?: number;
    editing?: boolean;
  };
  
export interface ElementDefinition {
label: string;
defaultText: string;
render: (
    props: RenderableElementProps & { updateElement?: (patch: Partial<RenderableElementProps>) => void }
) => JSX.Element;
getContextMenuItems: (
    props: RenderableElementProps & { updateElement?: (patch: Partial<RenderableElementProps>) => void }
) => ContextMenuItem[];
}