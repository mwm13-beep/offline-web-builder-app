// Sidebar.tsx
import { getElementLabel } from "./elements/elementUtils";
import { getAllElementDefinitions } from "./elements/ElementRegistry"
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [elements, setElements] = useState<string[]>([]);

  useEffect(() => {
    const keys = Object.keys(getAllElementDefinitions());
    setElements(keys);
  }, []);

  return (
    <div className="sidebar">
      <h2>Elements</h2>
      {elements.map((el) => (
        <div
          key={el}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", el)}
          style={{ border: "1px solid #888", margin: "5px", padding: "4px" }}
        >
          {getElementLabel(el)}
        </div>
      ))}
    </div>
  );
}
