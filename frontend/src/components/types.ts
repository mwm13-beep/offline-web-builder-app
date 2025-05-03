import React from "react";

//context menu options
export type ContextMenuItem = {
  label: string;
  onSelect: () => void;
};

//stores data on elements currently on the canvas
export type CanvasElementData = {
  type?: string;
  x: number;
  y: number;
  text?: string;
  src?: string;
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
  editing: boolean;
  actionType?: string;
  actionParams?: any;
};

//wrapper that allows canvas elements to be moved and resized
export type DraggableBoxProps = CanvasElementData & {
  children: React.ReactNode;
  onResize: (width: number, height: number) => void;
};
