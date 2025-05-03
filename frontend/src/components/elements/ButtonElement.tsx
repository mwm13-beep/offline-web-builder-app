import { RenderableElementProps, ElementDefinition } from "./elementTypes";
import { registerElement } from "./ElementRegistry";

export const ButtonElement: ElementDefinition = {
    label: "Button",
    defaultText: "Button",
    render: (props: RenderableElementProps & { updateElement?: (patch: Partial<RenderableElementProps>) => void }) => {
      const ButtonComponent = () => {
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          props.updateElement?.({ text: e.target.value });
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            props.updateElement?.({ editing: false });
          }
        };

        const handleBlur = () => {
          props.updateElement?.({ editing: false });
        };
    
        const handleDoubleClick = () => {
          props.updateElement?.({ editing: true });
        };

        const displayText = props.text ?? ButtonElement.defaultText;

        return props.editing ? (
          <input 
            type="text"
            value={displayText}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#e0e0e0",
              color: "black",
              border: "1px solid black",
              padding: "2px",
            }}
            autoFocus
          />
        ) : (
          <button
            onDoubleClick = {handleDoubleClick}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#e0e0e0",
              color: "black",
              border: "1px solid black",
            }}
          >
            {displayText}
          </button>
        );
      };

      return <ButtonComponent />;
    },
    getContextMenuItems: (props) => [
      {
        label: "Edit Text",
        onSelect: () => props.updateElement?.({ editing: true }),
      },
      {
        label: "Assign Action",
        onSelect: () => alert("Not implemented"),
      },
    ],
  };

  registerElement("Button", ButtonElement);