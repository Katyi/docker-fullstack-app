'use client';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const myImageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  // src - это относительный путь, который вы передаете в пропс src компонента <Image />
  // например, "/media/1752639384800-IMG_6635-EDIT.jpg"
  // BASE_URL - это ваш http://localhost:4000 или http://postcardfolio.ru
  const url = `${BASE_URL}${src}`;
  // Вы можете добавить параметры ширины и качества, если ваш API их поддерживает
  // Например: return `${url}?w=${width}&q=${quality || 75}`;
  return url;
};
