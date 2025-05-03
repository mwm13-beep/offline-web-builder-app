// CanvasArea.tsx
import { useState } from 'react';
import { CanvasElementData } from "./types";
import DraggableBox from './DraggableBox';
import { ContextMenuItem } from "./types";
import { preloadImage, processImage } from "../utils/image";
import React from 'react';
import { handler } from "../handlers/handlerMap";
import CustomContextMenu from './ContextMenu';
import { getContextMenuItems } from './contextMenuMappings';
import { createDefaultElement, isImageElement } from './elements/elementUtils';
import { getElementDefinition } from './elements/ElementRegistry';

export default function CanvasArea() {
  //canvas properties
  const [elements, setElements] = useState<CanvasElementData[]>([]);
  const [defaultImage, setDefaultImage] = useState<HTMLImageElement>();
  const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);
  const defaultImagePath = "/assets/image.jpg";

  //functions
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

  function handleRightClick(e: React.MouseEvent) {
    e.preventDefault();

    let target = e.target as HTMLElement;
    const elementBox = target.closest(".draggable-box") as HTMLElement | null;

    if(elementBox) {
      const index = elementBox.dataset.index !== undefined ? parseInt(elementBox.dataset.index) : -1;    
      const element = index >= 0 && index < elements.length ? elements[index] : undefined;
      if (element && element.type) {
        const menu = getContextMenuItems(element.type, element);
        setContextMenuItems(menu);
        return;
      }
    }

    setContextMenuItems([
      {
        label: "Paste",
        onSelect: handleContextPaste
      }
    ]);
  }

  //async functions
  async function tryParseImage(blob: Blob): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
  
      img.onload = () => {
        URL.revokeObjectURL(url);  // <-- Revoke *after* successful load
        resolve(img);
      };
      img.onerror = (event) => {
        console.error("Image failed to load", event);
        URL.revokeObjectURL(url);
        resolve(null);
      };      
  
      img.src = url;
    });
  }

  async function handleContextPaste() {
    try {
      const canvas = document.querySelector(".canvas")?.getBoundingClientRect();
      if (!canvas) return;

      const clipboardItems = await navigator.clipboard.read();

      for (const item of clipboardItems) {

        for (const type of item.types) {
          const blob = await item.getType(type);
          const maybeImage = await tryParseImage(blob);
          
          if (maybeImage) {
            // It's actually an image!
            const success = handler({
              data: blob,
              canvas,
              createElement: (element) => {
                setElements((prev) => [...prev, element]);
              },
            });
            if (success) return;
          }
          
          // If not an image, fallback to original text handling
          const success = handler({
            data: blob,
            canvas,
            createElement: (element) => {
              setElements((prev) => [...prev, element]);
            },
          });
          if (success) return;
        }
      }
    } catch (err) {
        console.error("Clipboard read error:", err);
    }
  }
  
  //useEffects
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
  
  //TSX structure
  return (
    <div
      className="canvas"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onContextMenu={handleRightClick}
    >
      <CustomContextMenu menuItems={contextMenuItems}>
        {elements.map((element, i) => {
          const { type, x, y, src, text, width, height, canvasWidth, canvasHeight, editing } = element;

          const updateElement = (newProps: Partial<typeof element>) => {
            setElements(prev => {
              const updated = [...prev];
              updated[i] = {
                ...updated[i], 
                ...newProps
              };
              return updated;
            });
          };
          
          return (
            <DraggableBox
              key={i}
              x={x}
              y={y}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              editing={editing}
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
              data-index={i}
            >
            {(type && getElementDefinition(type)) 
              ? renderContent(type, { 
                src, 
                text, 
                width, 
                height,
                updateElement,
                editing,
              }) 
            : null}
          </DraggableBox>  
          )
        })}
      </CustomContextMenu>
    </div>
  );
}
  