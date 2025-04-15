export function preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  
      // Force reload in case it's cached but didn't fire onload
      img.src = `${src}?cb=${Date.now()}`; // cache buster
    });
  }
  