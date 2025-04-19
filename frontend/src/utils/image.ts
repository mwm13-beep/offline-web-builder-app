export function preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  
      // Force reload in case it's cached but didn't fire onload
      img.src = `${src}?cb=${Date.now()}`; // cache buster
    });
  }
  
export function processImage(
    img: HTMLImageElement,
    canvas: DOMRect
    ): { width: number; height: number } {
    const maxW = canvas.width * 0.5;
    const maxH = canvas.height * 0.5;

    const widthRatio = maxW / img.width;
    const heightRatio = maxH / img.height;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    return {
        width: img.width * ratio,
        height: img.height * ratio,
    };
}
  