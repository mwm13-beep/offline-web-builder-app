import { TextElement } from "./TextElement";
import { ImageElement } from "./ImageElement";
// Import more elements as needed later

// Map MIME type prefixes to element labels
export const TYPE_MAPPINGS: Record<string, string> = {
  "text/": TextElement.label,
  "image/": ImageElement.label,
  // later you might add "audio/", "video/", etc.
};
