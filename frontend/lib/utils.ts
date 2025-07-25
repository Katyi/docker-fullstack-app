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
  const url = `${BASE_URL}${src}`;
  return url;
};
