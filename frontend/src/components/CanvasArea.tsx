// CanvasArea.tsx
import { useState } from 'react';
import { ElementData } from "./types";
import DraggableBox from './DraggableBox';
import { createDefaultElement } from "./types";
import { preloadImage } from "../utils/image";
import React from 'react';

export default function CanvasArea() {
    const [elements, setElements] = useState<ElementData[]>([]);
    const [defaultImage, setDefaultImage] = useState<HTMLImageElement>();
    //const [loading, setLoading] = useState(true);

    function handleDrop(e: React.DragEvent) {
      // if (loading) {
      //   e.preventDefault();
      //   console.warn("⏳ Drop ignored because image is still loading.");
      //   return;
      // }

      e.preventDefault();
      const type = e.dataTransfer.getData("text/plain");
      const canvas = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvas.left;
      const y = e.clientY - canvas.top;

      const newElement = createDefaultElement(type, x, y, canvas.width, canvas.height);
    
      // handles img drop /w no image specified by the user
      if (type === "img") {
          const maxW = canvas.width * 0.5;
          const maxH = canvas.height * 0.5;
      
          let width: number | undefined = defaultImage?.width;
          let height: number | undefined = defaultImage?.height;

          if (width && height) {
            const widthRatio = maxW / width;
            const heightRatio = maxH / height;
            const ratio = Math.min(widthRatio, heightRatio, 1);
        
            newElement.width = width * ratio;
            newElement.height = height * ratio;
          }

          setElements(prev => [...prev, newElement]);
        } else {
        // handles other types
        setElements(prev => [...prev, newElement]);
      }
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
          //setLoading(false);
          console.log("✅ Default image loaded and stored");
        })
        .catch(err => {
          //setLoading(false);
          console.error(err.message);
        });
    }, []);

    return (
      <div
        className="canvas"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {elements.map(({ type, x, y, src, width, height, canvasWidth, canvasHeight }, i) => (
          // if (loading) {
          //   return <div className="loading-spinner">🔄 Loading default image...</div>;
          // }
          // if (!width || !height || width === 0 || height === 0) {
          //   return null;
          // }
          // else {
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
          //}
        ))}
      </div>
    );
  }
  