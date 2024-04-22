import { BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="from-regalBlue to-mutedBlue bg-gradient-to-r">
      <div className="navbar bg-transparent shadow-none container mx-auto h-[88px]">
        <div className="navbar-start">
          <a className="navbar-item">
            <Image src="/PENS.png" alt="logo" width="50" height="50" />
          </a>
        </div>
        <div className="navbar-center">
          <a className="navbar-item font-medium">Beranda</a>
          <a className="navbar-item font-medium">Jurusan</a>
          <a className="navbar-item font-medium">Dashboard</a>
        </div>
        <div className="navbar-end">
          <BellIcon className="navbar-item size-12 mr-2" />
          <div className="flex items-center gap-x-2">
            <Image src="/profile.png" alt="profile" width="40" height="40" />
            <a className="navbar-item">Bintang Rezeka Ramadani</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
