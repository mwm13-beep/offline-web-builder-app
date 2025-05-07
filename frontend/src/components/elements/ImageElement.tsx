import { RenderableElementProps, ElementDefinition } from "./elementTypes";
import { registerElement } from "./ElementRegistry";

export const ImageElement: ElementDefinition = {
    label: "Image",
    defaultText: "Image",
    render: (props: RenderableElementProps) => (
      <img
        src={props.src}
        style={{
          width: props.width || 100,
          height: props.height || 50,
          objectFit: "contain",
        }}
        draggable={false}
      />
    ),
    getContextMenuItems: (props: RenderableElementProps) => [
      {
        label: "Example Action",
        onSelect: () => alert("Action triggered"),
      },
    ],
};

console.log('🟦 ImageElement registering...');
registerElement("Image", ImageElement);