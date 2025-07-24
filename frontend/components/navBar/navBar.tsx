'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/app/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DropdownMenuDemo from '../ui/dropdown-menu';
import { headerMenuItems, headerMenuItems_2 } from '@/lib/constants';
import { BASE_URL } from '@/lib/requestMethods';
import { myImageLoader } from '@/lib/utils';

const NavBar = () => {
  const router = useRouter();
  const { user, logout, isLoading, checkAuth, error } = useAuthStore();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await logout();
    router.push('/');
  };

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

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

  return isLoading ? (
    <div className="h-[155px] bg-[#ecebe9]"></div>
  ) : (
    <div
      className="sticky top-0 z-20 bg-[#ecebe9] opacity-[100%] w-[100vw] 
        flex flex-col justify-center px-[10vw] py-4 h-[188px] md:h-[155px]"
    >
      {/* FIRST ROW */}
      <div className="flex justify-between items-center h-fit md:h-[66px] bg-white md:bg-transparent p-2 md:p-0">
        <Link href={'/'}>
          <Image
            src="/logo.png"
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-auto h-9 md:w-auto md:h-[54px] object-fill cursor-pointer ml-1 lg:ml-0"
            priority={true}
          />
        </Link>

        {user?.id ? (
          <div className="flex md:items-center justify-between gap-2">
            <div className="hidden md:flex flex-col items-end h-[66px]">
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

            <Image
              src="/log-out.svg"
              alt="logout"
              width={24}
              height={24}
              className="cursor-pointer md:hidden "
              onClick={handleLogout}
            />
            <Image
              src="/account.svg"
              alt="account"
              width={24}
              height={24}
              className="cursor-pointer md:hidden mr-1"
              onClick={() => router.push('/account')}
            />
            <Link href={'/account'} className="p-1 bg-gray-100 hidden md:block">
              <Image
                loader={myImageLoader}
                src={user.imageUrl ? `${user?.imageUrl}` : '/user.png'}
                alt="avatar"
                width={58}
                height={58}
                // style={{ width: '58px', height: '58px' }}
                className="cursor-pointer object-cover"
              />
            </Link>
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
      <div className="mt-8 flex md:items-center md:justify-center flex-wrap gap-2 md:gap-0 md:flex-nowrap">
        <Link
          href={'/'}
          className={`${
            pathname === '/'
              ? isMobile
                ? 'rectangleFocus'
                : 'halfLeftParallelogramFocus'
              : isMobile
              ? 'rectangle'
              : 'halfLeftParallelogram'
          } `}
        >
          <p className="menuTitle">HOME</p>
        </Link>

        {user?.id ? (
          <DropdownMenuDemo title={'POSTCARDS'} menuItems={headerMenuItems} />
        ) : (
          <Link
            href={'/sign-up'}
            className={`${
              pathname === '/login' || pathname === '/sign-up'
                ? isMobile
                  ? 'rectangleFocus'
                  : 'parallelogramFocus mr-3'
                : isMobile
                ? 'rectangle'
                : 'parallelogram mr-3'
            }`}
          >
            <p className={`${isMobile ? 'menuTitle' : 'menuTitle1'}`}>
              {pathname === '/login' ? 'LOGIN' : 'SIGN UP'}
            </p>
          </Link>
        )}

        {/* может когда контента будет больше */}
        {/* <DropdownMenuDemo title={'EXPLORE'} menuItems={headerMenuItems_2} /> */}

        <Link
          replace
          href={'/users'}
          className={`${
            pathname === '/users'
              ? isMobile
                ? 'rectangleFocus'
                : 'parallelogramFocus'
              : isMobile
              ? 'rectangle'
              : 'parallelogram'
          }`}
        >
          <p className={`${isMobile ? 'menuTitle' : 'menuTitle1'}`}>USERS</p>
        </Link>

        <Link
          replace
          href={'/blog'}
          className={`${
            pathname === '/blog'
              ? isMobile
                ? 'aboutRectangleFocus'
                : 'halfRightParallelogramFocus'
              : isMobile
              ? 'aboutRectangle'
              : 'halfRightParallelogram'
          }`}
        >
          <p className={`${isMobile ? 'menuTitle' : 'menuTitle2'}`}>BLOG</p>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
