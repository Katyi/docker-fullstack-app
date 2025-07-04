import { useMemo } from "react";

type Img = {
  src: string;
  alt?: string;
  aspectRatio: number; // width / height
};



export function useJustifiedLayout(
  images: Img[],
  containerWidth: number,
  rowHeight: number,
  margin: number
): JustifiedBox[][] {
  return useMemo(() => {
    const rows: JustifiedBox[][] = [];
    let currentRow: JustifiedBox[] = [];
    let currentRowWidth = 0;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const width = img.aspectRatio * rowHeight;
      currentRow.push({ ...img, width, height: rowHeight, originalIndex: i });
      currentRowWidth += width + margin;

      if (currentRowWidth - margin > containerWidth && currentRow.length > 0) {
        // Масштабируем ширины, чтобы заполнить контейнер
        const scale = (containerWidth - margin * (currentRow.length - 1)) /
          (currentRowWidth - margin * currentRow.length);
        for (const box of currentRow) {
          box.width = box.width * scale;
          box.height = rowHeight * scale;
        }
        rows.push(currentRow);
        currentRow = [];
        currentRowWidth = 0;
      }
    }
    // Последний ряд — не масштабируем, просто добавляем
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
    return rows;
  }, [images, containerWidth, rowHeight, margin]);
}