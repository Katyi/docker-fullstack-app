'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DropdownMenuDemo = ({
  title,
  menuItems,
}: {
  title: string;
  menuItems: HeaderMenuItem[];
}) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth < 768); // Настройте порог по своему усмотрению
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={
          (pathname === '/postcards' ||
            pathname.split('/')[1] === 'postcards' ||
            pathname === '/albums' ||
            pathname.split('/')[1] === 'albums' ||
            pathname === '/faves') &&
          menuItems[0].url === '/postcards'
            ? `${isMobile ? 'rectangleFocus' : 'parallelogramFocus'}`
            : // 'parallelogramFocus'
            (pathname === '/users' || pathname.split('/')[1] === 'users') &&
              menuItems[0].url === '/users'
            ? `${isMobile ? 'rectangleFocus' : 'parallelogramFocus'}`
            : `${isMobile ? 'rectangle' : 'parallelogram'}`
        }
        asChild
      >
        <div className="cursor-pointer">
          <p className={`${isMobile ? 'menuTitle' : 'menuTitle1'}`}>{title}</p>
          <ChevronDownIcon
            className={`${isMobile ? `menuTitle3` : 'menuTitle1 ml-1'}`}
          />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-white w-[calc(80vw/2-4px)] md:w-[calc(80vw/4-13px)] md:ml-[-24px] mt-0.5 rounded-b-md z-20">
        {menuItems.map((item) => (
          <DropdownMenu.Item
            key={item.label}
            className="flex flex-col focus:outline-none"
            asChild
          >
            <Link className="cursor-pointer" href={item.url}>
              <p className="hover:bg-[#d72147] hover:text-white px-4 py-1">
                {item.label}
              </p>
              {item.label !== 'FAVES' && (
                <DropdownMenu.Separator className="h-px bg-gray-200" />
              )}
            </Link>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;
