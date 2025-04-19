// CanvasArea.tsx
import { useState } from 'react';
import { ElementData } from "./types";
import DraggableBox from './DraggableBox';
import { createDefaultElement } from "./types";
import { preloadImage, processImage } from "../utils/image";
import React from 'react';
import { handler } from "../handlers/handlerMap";

export default function CanvasArea() {
  const [elements, setElements] = useState<ElementData[]>([]);
  const [defaultImage, setDefaultImage] = useState<HTMLImageElement>();
  const [contextMenu, setContextMenu] = useState<{ x:number, y:number } | null>(null);
  const defaultImagePath = "/assets/image.jpg";

  function handleContextMenu(e: React.MouseEvent){

  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
  
    const types = e.dataTransfer.types;
  
    if (types.includes("Files")) {
      return handleFileDrop(e);
    }
  
    if (types.includes("text/plain")) {
      return handleSidebarDrop(e);
    }
  
    console.warn("Unhandled drop type:", types);
  }
    
  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (!files.length) return;

    const file = files[0];
    const canvas = e.currentTarget.getBoundingClientRect();

    if (handler({
      data: file, 
      canvas: canvas, 
      createElement: (element) => { setElements((prev) => [...prev, element]) }
    })) {
      return;
    }
      console.warn("Unsupported file type:", file.type);
  }

  function handleSidebarDrop(e: React.DragEvent) {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    const canvas = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvas.left;
    const y = e.clientY - canvas.top;

    const newElement = createDefaultElement(type, x, y, canvas.width, canvas.height);
    
    if (type === "img" && defaultImage) {
        const { width, height } = processImage(defaultImage, canvas)
        newElement.width = width;
        newElement.height = height;
        newElement.src = defaultImagePath;
    }
    setElements(prev => [...prev, newElement]);
  }

  function renderContent(type: string | undefined, src: string | undefined, width: number, height: number) {
    if (type === "img") {
      return <img src={src} style={{ width: width || 100, height: height || 50, objectFit: "contain" }} draggable={false}/>;
    }
    return (
      <div
        contentEditable
        style={{
          minWidth: 100,
          minHeight: 50,
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        {type}
      </div>
    );
  }

  React.useEffect(() => {
    preloadImage("/assets/image.jpg")
      .then(img => {
        setDefaultImage(img);
        console.log("✅ Default image loaded and stored");
      })
      .catch(err => {
        console.error(err.message);
      });

      const handlePaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
      
        const canvas = document.querySelector(".canvas")?.getBoundingClientRect();
        if (!canvas) return;
      
        for (const item of items) {
          if (handler({
            data: item,
            canvas: canvas,
            createElement: (element) => { setElements((prev) => [...prev, element]) }
          })) {
            return;
          } 
        }
        console.warn("⚠️ Unsupported paste content.");
      };
      
      window.addEventListener("paste", handlePaste);
      return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div
      className="canvas"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {elements.map(({ type, x, y, src, width, height, canvasWidth, canvasHeight }, i) => (
        <DraggableBox
          key={i}
          x={x}
          y={y}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          width={width}
          height={height}
          onResize={(newWidth, newHeight) => {
            setElements((prev) => {
              const updated = [...prev];
              updated[i] = {
                ...updated[i],
                width: newWidth,
                height: newHeight,
              };
              return updated;
            });
          }}
        >
        {renderContent(type, src, width, height)}
        </DraggableBox>            
      ))}
    </div>
  );
}
  