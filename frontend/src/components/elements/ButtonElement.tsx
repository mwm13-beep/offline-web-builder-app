import { ElementProps } from "./renderDefinitions";

export const ButtonElement = {
    label: "Button",
    defaultText: "Button",
    render: (props: ElementProps) => (
      <button
        contentEditable
        style={{
          width: 25,
          height: 10,
        }}
      >
        {props.text}
      </button>
    ),
  };