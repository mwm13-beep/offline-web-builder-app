// CanvasArea.tsx
import { useState } from 'react';

export default function CanvasArea() {
  const [elements, setElements] = useState<string[]>([]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    setElements((prev) => [...prev, type]);
  }

  return (
    <div
      className="canvas"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {elements.map((type, i) => (
        <div key={i} style={{ margin: "10px", border: "1px dashed #aaa", padding: "8px" }}>
          {type === "img" ? <img src="https://via.placeholder.com/100" alt="img" /> : <p>{type}</p>}
        </div>
      ))}
    </div>
  );
}
