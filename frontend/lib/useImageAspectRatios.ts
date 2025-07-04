import { useEffect, useState } from "react";

export function useImageAspectRatios(postcards:
  { imageUrl: string; title: string }[]
) {
  const [images, setImages] = useState<{ src: string; alt: string; aspectRatio: number; originalIndex: number }[]>([]);

  useEffect(() => {
    Promise.all(
      postcards.map(
        (p, i) =>
          new Promise<{ src: string; alt: string; aspectRatio: number; originalIndex: number }>((resolve) => {
            const img = new window.Image();
            img.src = p.imageUrl;
            img.onload = () => {
              resolve({
                src: p.imageUrl,
                alt: p.title || '',
                aspectRatio: img.naturalWidth / img.naturalHeight,
                originalIndex: i,
              });
            };
            img.onerror = () => {
              resolve({
                src: p.imageUrl,
                alt: p.title || '',
                aspectRatio: 1,
                originalIndex: i,
              });
            };
          })
      )
    ).then((results) => setImages(results));
  }, [postcards]);

  return images;
}