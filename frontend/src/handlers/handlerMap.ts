import { handleImageFile } from "./imageHandler";
import { handleTextContent } from "./textHandler";

// File overload
function isImageData(input: File): input is File;
// DataTransferItem overload
function isImageData(input: DataTransferItem): input is DataTransferItem;
// Shared implementation
function isImageData(input: any): boolean {
  if (input instanceof File) {
    return input.type.startsWith("image/");
  }

  if (typeof DataTransferItem !== "undefined" && input instanceof DataTransferItem) {
    return input.type.startsWith("image/");
  }

  return false;
}

// File overload
function isPlainTextData(input: string): input is string;
// DataTransferItem overload
function isPlainTextData(input: DataTransferItem): input is DataTransferItem;
// Shared implementation
function isPlainTextData(input: any): boolean {
  if (typeof input === "string") return true;

  if (typeof DataTransferItem !== "undefined" && input instanceof DataTransferItem) {
    return input.type === ("text/plain");
  }

  return false;
}

export function handler(opts: {
  data: string | File | DataTransferItem;
  canvas: DOMRect;
  createElement: (element: any) => void;
}): boolean {
  const { data, canvas, createElement } = opts;

  // 🔍 Case 1: File input (e.g. from drag-and-drop)
  if (data instanceof File) {
    if (isImageData(data)) {
      handleImageFile({ kind: "image", data, canvas, createElement });
      return true;
    }

    // Add more file type handlers here if needed

    console.warn(`❌ No file handler for type: ${data}`);
    return false;
  }

  // 🔍 Case 2: DataTransferItem input (e.g. from clipboard)
  if (typeof DataTransferItem !== "undefined" && data instanceof DataTransferItem) {
    if (isImageData(data)) {
      const file = data.getAsFile();
      if (file) {
        handleImageFile({ kind: "image", data: file, canvas, createElement });
        return true;
      }
    }

    if (isPlainTextData(data)) {
      return new Promise<void>((resolve) => {
        data.getAsString((text) => {
          handleTextContent({ kind: "text", data: text, canvas, createElement });
          resolve();
        });
      }).then(() => true).catch(() => false) as unknown as boolean; // quick cast workaround
    }

    console.warn(`❌ No DataTransferItem handler for type: ${data}`);
    return false;
  }

  // 🔍 Case 3: Raw string input (if ever used manually)
  if (typeof data === "string") {
    handleTextContent({ kind: "text", data, canvas, createElement });
    return true;
  }

  console.warn("❌ No handler matched for input:", data);
  return false;
}
