import React from "react";

export type ElementData = {
  type?: string;
  x: number;
  y: number;
  src?: string;
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
};

export const createDefaultElement = (
    type: string,
    x: number,
    y: number,
    canvasWidth: number,
    canvasHeight: number
  ): ElementData => ({
    type,
    x,
    y,
    src: type === "img" ? "/assets/image.jpg" : undefined,
    width: 100,
    height: 50,
    canvasWidth,
    canvasHeight,
  });
  

export type DraggableBoxProps = ElementData & {
  children: React.ReactNode;
  onResize: (width: number, height: number) => void;
};
