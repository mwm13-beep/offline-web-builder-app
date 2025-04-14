import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css';

type Props = {
    x: number;
    y: number;
    children: React.ReactNode;
    canvasWidth: number;
    canvasHeight: number;
    width?: number;
    height?: number;
  };
  

export default function DraggableBox({ x, y, children, width, height, canvasWidth, canvasHeight }: Props) {
  const [position, setPosition] = useState({ x, y });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  }

  function onMouseUp() {
    setDragging(false);
  }

  React.useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <ResizableBox width={width} height={height} minConstraints={[50, 30]} maxConstraints={[canvasWidth, canvasHeight]}>
        <div
        onMouseDown={onMouseDown}
        style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            cursor: "grab",
            border: "1px dashed #aaa",
            backgroundColor: "#eee",
            padding: 8,
            width: width ?? 100,
            height: height ?? 50,
            userSelect: "none",
        }}      
        >
        {children}
        </div>
    </ResizableBox>
  );
}
