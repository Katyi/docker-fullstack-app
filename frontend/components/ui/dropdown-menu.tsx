'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DropdownMenuDemo = ({
  title,
  menuItems,
}: {
  title: string;
  menuItems: HeaderMenuItem[];
}) => {
  const pathname = usePathname();

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
            ? 'parallelogramFocus'
            : (pathname === '/users' || pathname.split('/')[1] === 'users') &&
              menuItems[0].url === '/users'
            ? 'parallelogramFocus'
            : 'parallelogram'
        }
        asChild
      >
        <div className="cursor-pointer">
          <p className="menuTitle1">{title}</p>
          <ChevronDownIcon className="menuTitle1 ml-2" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-white w-[calc(80vw/4-13px)] ml-[-24px] mt-0.5 rounded-b-md z-20">
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
