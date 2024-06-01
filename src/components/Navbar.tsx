import { BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useContext } from "react";
import { NavbarContext } from "../contexts/navbarContext";

const Navbar = () => {
  const { identity } = useContext(NavbarContext);
  return (
    <div className="from-regalBlue to-mutedBlue bg-gradient-to-r">
      <div className="navbar bg-transparent shadow-none container mx-auto h-[88px]">
        <div className="navbar-start">
          <a className="navbar-item">
            <Image
              src="https://pens-api-staging.superrexy-dev.my.id/public/uploads/logos/logo.png"
              alt="PENS COURSE"
              width="50"
              height="50"
            />
          </a>
        </div>

        <div className="navbar-end">
          <div className="flex items-center gap-x-5">
            <Image src="/profile.png" alt="profile" width="40" height="40" />
            <a className="text-white">{identity ? identity : "Guest"}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
