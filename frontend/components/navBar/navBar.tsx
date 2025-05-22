'use client';

import useAuthStore from '@/app/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DropdownMenuDemo from '../ui/dropdown-menu';
import { headerMenuItems, headerMenuItems_2 } from '@/lib/constants';

const NavBar = () => {
  const router = useRouter();
  const { user, logout, isLoading, getUser } = useAuthStore();
  const pathname = usePathname();

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await logout();
    router.push('/');
  };

  return isLoading ? (
    <div className="h-[155px] bg-[#ecebe9]"></div>
  ) : (
    pathname !== '/login' && pathname !== '/sign-up' && (
      <div className="sticky top-0 z-20 bg-[#ecebe9] opacity-[100%] w-[100vw] flex flex-col px-[10vw] py-4 h-[155px]">
        {/* FIRST ROW */}
        <div className="flex justify-between items-center h-[66px]">
          <Link href={'/'}>
            <Image
              src="/logo.png"
              alt="logo"
              width={412}
              height={54}
              priority={true}
            />
          </Link>

          {user?.id ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col items-end h-[66px]">
                <p className="font-bold">Hello, {user.name}!</p>
                <p
                  className="text-sm cursor-pointer"
                  onClick={() => router.push('/account')}
                >
                  → Settings
                </p>
                <p className="text-sm cursor-pointer" onClick={handleLogout}>
                  × Sign out
                </p>
              </div>
              <div className="p-1 bg-gray-100">
                <Image
                  src={user?.imageUrl ? user.imageUrl : '/user.png'}
                  alt="avatar"
                  width={58}
                  height={58}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                className="border border-[#3475b9] border-solid bg-[#3475b9] text-white px-7 py-[7px] rounded-sm text-sm font-bold cursor-pointer"
                onClick={() => router.push('/login')}
              >
                LOG IN
              </button>
            </div>
          )}
        </div>

        {/* SECOND ROW */}
        <div className="mt-8 flex items-center justify-center">
          <Link href={'/'} className="halfLeftParallelogram">
            <p className="menuTitle">HOME</p>
          </Link>

          {user?.id ? (
            <DropdownMenuDemo title={'POSTCARDS'} menuItems={headerMenuItems} />
          ) : (
            <Link href={'/sign-up'} className="parallelogram">
              <p className="menuTitle1">SIGN UP</p>
            </Link>
          )}

          <DropdownMenuDemo title={'EXPLORE'} menuItems={headerMenuItems_2} />

          <Link replace href={'/about'} className="halfRightParallelogram">
            <p className="menuTitle2">ABOUT</p>
          </Link>
        </div>
      </div>
    )
  );
};

export default NavBar;
