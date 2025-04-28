// CanvasArea.tsx
import { useState } from 'react';
import { ElementData } from "./types";
import DraggableBox from './DraggableBox';
import { createDefaultElement } from "./types";
import { preloadImage, processImage } from "../utils/image";
import React from 'react';
import { handler } from "../handlers/handlerMap";
import CustomContextMenu from './ContextMenu';
import { ELEMENT_DEFINITIONS, getElementDefinition, isImageElement } from './elements/renderDefinitions';

export default function CanvasArea() {
  const [elements, setElements] = useState<ElementData[]>([]);
  const [defaultImage, setDefaultImage] = useState<HTMLImageElement>();
  const defaultImagePath = "/assets/image.jpg";

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
    
    if (isImageElement(type) && defaultImage) {
        const { width, height } = processImage(defaultImage, canvas)
        newElement.width = width;
        newElement.height = height;
        newElement.src = defaultImagePath;
    }
    setElements(prev => [...prev, newElement]);
  }

  function renderContent(type: string, props: any) {
    const definition = getElementDefinition(type);
    if (definition) {
      return definition.render(props);
    }
    return (
      <div style={{ border: "1px solid red", padding: "4px" }}>
        Unknown Element
      </div>
    );    
  }

  function handlePaste(e: ClipboardEvent) {
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
        return; //only paste the first match
      } 
    }
    console.warn("⚠️ Unsupported paste content.");
  }
  
  async function handleContextPaste() {
    try {
        const canvas = document.querySelector(".canvas")?.getBoundingClientRect();
        if (!canvas) return;

        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          for (const type of item.types) {
              const blob = await item.getType(type);
              const success = handler({
                  data: blob,
                  canvas: canvas,
                  createElement: (element) =>
                      setElements((prev) => [...prev, element]),
              });
              if (success) return;
          }
        }
        console.warn("❗ Unsupported clipboard content.");
    } catch (err) {
        console.error("Clipboard read error:", err);
    }
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
  }, []);

  React.useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);
  

  return (
    <div
      className="canvas"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <CustomContextMenu onPaste={handleContextPaste}/>
      {elements.map(({ type, x, y, src, text, width, height, canvasWidth, canvasHeight }, i) => (
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
        {(type && type in ELEMENT_DEFINITIONS) ? renderContent(type, { src, text, width, height }) : null}
        </DraggableBox>            
      ))}
    </div>
  );
}
  