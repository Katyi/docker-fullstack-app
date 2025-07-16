import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className="z-20 bg-[#ecebe9] w-[100vw] flex items-center justify-between px-[10vw] py-4 h-[90px]">
      <div className="flex items-center gap-2">
        <p className="font-[300] text-slate-600 text-small-bold">
          Copyright © A.Egorova {new Date().getFullYear()}
        </p>
        <Link
          href="https://github.com/Katyi/docker-fullstack-app"
          target="_blank"
          tabIndex={-1}
        >
          <Image src="/github.png" alt="githubIcon" width={40} height={40} />
        </Link>
      </div>
      <p className="font-[300] text-slate-600 text-small-bold">
        alex.frontender@gmail.com
      </p>
    </div>
  );
};

export default Footer;
