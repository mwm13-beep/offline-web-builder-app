import { RenderableElementProps, ElementDefinition } from "./elementTypes";
import { registerElement } from "./ElementRegistry";

export const TextElement:ElementDefinition  = {
    label: "Text",
    defaultText: "Editable text",
    render: (props: RenderableElementProps) => (
        <p
        contentEditable
        style={{
            minWidth: 100,
            minHeight: 50,
            width: "100%",
            height: "100%",
            overflow: "auto",
        }}
        >
            {props.text}
        </p>
    ),
    getContextMenuItems: (props: RenderableElementProps) => [
        {
          label: "Example Action",
          onSelect: () => alert("Action triggered"),
        },
      ],
};

console.log('🟦 TextElement registering...');
registerElement("Text", TextElement);