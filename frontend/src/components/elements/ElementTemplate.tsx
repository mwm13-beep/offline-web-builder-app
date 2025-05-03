import { ElementDefinition, RenderableElementProps } from "./elementTypes";
import { registerElement } from "./ElementRegistry";

export const TemplateElement: ElementDefinition = {
  label: "Template",
  defaultText: "Template text",
  render: (props: RenderableElementProps) => {
    return <div>{props.text}</div>;
  },
  getContextMenuItems: (props: RenderableElementProps) => [
    {
      label: "Example Action",
      onSelect: () => alert("Action triggered"),
    },
  ],
};

registerElement("Template", TemplateElement)
