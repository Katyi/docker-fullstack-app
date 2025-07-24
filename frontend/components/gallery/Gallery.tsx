import { useRef, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useJustifiedLayout } from '@/lib/useJustifiedLayout';
import { Card } from '@radix-ui/themes';
import Image from 'next/image';
import Tooltip from '@/components/ui/tooltip';
import { myImageLoader } from '@/lib/utils';

interface GalleryProps<T> {
  items: T[];
  getPostcard: (item: T) => Postcard;
  renderCardContent: (item: T) => ReactNode;
}

export default function Gallery<T>({
  items,
  getPostcard,
  renderCardContent,
}: GalleryProps<T>) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  const postcards = items.map(getPostcard);

  const images = postcards.map((p, i) => ({
    src: p.imageUrl,
    alt: p.title || '',
    aspectRatio: p.width && p.height ? p.width / p.height : 1,
    originalIndex: i,
  }));

  // Следим за шириной контейнера (адаптивность)
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const rowHeight = 340;
  const margin = 8;
  const rows = useJustifiedLayout(images, containerWidth, rowHeight, margin);

  return (
    <div ref={containerRef} className="w-full">
      {rows.map((row, i) => (
        <div key={i} className="flex mb-2" style={{ gap: `${margin}px` }}>
          {row.map((img, j) => {
            const item = items[img.originalIndex];
            return (
              <Card
                key={j}
                className="shadow-lg bg-gray-100 overflow-hidden flex flex-col rounded-lg"
                style={{
                  width: img.width,
                  height: img.height + 60,
                }}
              >
                <div
                  style={{
                    width: img.width,
                    height: img.height,
                    position: 'relative',
                  }}
                >
                  <Tooltip content="View postcard">
                    <Image
                      loader={myImageLoader}
                      src={img.src}
                      alt={img.alt || ''}
                      fill
                      sizes="auto"
                      className="rounded-t-[8px] cursor-pointer object-cover"
                      onClick={() => {
                        const id =
                          (item as any)?.postcardId ?? (item as any)?.id;
                        if (id) {
                          router.push(`/postcards/${id}`);
                        }
                      }}
                    />
                  </Tooltip>
                </div>
                {renderCardContent(item)}
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
}
