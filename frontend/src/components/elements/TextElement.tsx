import { ElementProps } from "./renderDefinitions";

export const TextElement = {
    label: "Text",
    defaultText: "Editable text",
    render: (props: ElementProps) => (
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
};