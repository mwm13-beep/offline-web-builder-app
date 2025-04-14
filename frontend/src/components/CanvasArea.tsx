// CanvasArea.tsx
import { useState } from 'react';
import DraggableBox from './DraggableBox'

export default function CanvasArea() {
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [elements, setElements] = useState<{ 
        type: string; 
        x: number; 
        y: number; 
        canvasWidth: number;
        canvasHeight: number;
        src?: string, 
        width?: number, 
        height?: number 
    }[]>([]);

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        const type = e.dataTransfer.getData("text/plain");
      
        const canvas = e.currentTarget.getBoundingClientRect();
        if (canvas) {
            const { width, height } = canvas;
            setCanvasSize({ width, height });
          }
        const x = e.clientX - canvas.left;
        const y = e.clientY - canvas.top;
      
        // Only fetch size info for images
        if (type === "img") {
          const img = new Image();
          img.onload = () => {
            const maxW = canvas.width * 0.5;
            const maxH = canvas.height * 0.5;
      
            let { width, height } = img;
      
            const widthRatio = maxW / width;
            const heightRatio = maxH / height;
            const ratio = Math.min(widthRatio, heightRatio, 1); // never upscale
      
            width *= ratio;
            height *= ratio;
   
            const newElement = { 
                type, 
                x, 
                y, 
                src: img.src, 
                canvasWidth: canvasSize.width, 
                canvasHeight: canvasSize.height, 
                width, 
                height };
            setElements(prev => [...prev, newElement]);
          };
          img.onerror = () => {
            console.warn(`Image failed to load: ${img.src}`);
            setElements(prev => [...prev, { type, x, y, canvasWidth: canvasSize.width, canvasHeight: canvasSize.height }]);
          };
          
          img.src = "/assets/pexels-pixabay-206359.jpg";
        } else {
          const newElement = { type, x, y, canvasWidth: canvasSize.width, canvasHeight: canvasSize.height };
          setElements(prev => [...prev, newElement]);
        }
      }
          
  return (
    <div
      className="canvas"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {elements.map(({ type, x, y, src, canvasWidth, canvasHeight, width, height }, i) => (
        <DraggableBox key={i} x={x} y={y} canvasWidth={canvasWidth} canvasHeight={canvasHeight} width={width} height={height}>
            {type === "img" ? (
            <img src={src} alt="img" style={{ width, height, objectFit: "contain" }} draggable={false} />
            ) : (
            <div
                contentEditable
                suppressContentEditableWarning
                style={{
                minWidth: 100,
                minHeight: 50,
                width,
                height,
                overflow: "auto",
                }}
            >
                {type}
            </div>
            )}
        </DraggableBox>
        ))
      }
    </div>
  );
}
