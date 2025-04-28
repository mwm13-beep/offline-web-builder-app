import { ElementProps } from "./renderDefinitions";

export const ImageElement = {
    label: "Image",
    render: (props: ElementProps) => (
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
};