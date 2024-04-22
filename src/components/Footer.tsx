import { ChatBubbleOvalLeftIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#FAFAFA] pb-8">
      <div className="container mx-auto text-black">
        <div className="grid grid-cols-4 py-10">
          <div>
            <Image src="/PENS-Color.png" alt="logo" width="100" height="100" />
          </div>
          <div>
            <p className="text-lg font-semibold">Our Links</p>
            <ol className="mt-4 gap-y-2 flex flex-col">
              <li>
                <a>PENS Website</a>
              </li>
              <li>
                <a>Students</a>
              </li>
              <li>
                <a>Lectures</a>
              </li>
              <li>
                <a>Online MIS</a>
              </li>
              <li>
                <a>PENS Editorial</a>
              </li>
            </ol>
          </div>
          <div>
            <p className="text-lg font-semibold">Internal Links</p>
            <ol className="mt-4 gap-y-2 flex flex-col">
              <li>
                <a>PENS Website</a>
              </li>
              <li>
                <a>Students</a>
              </li>
              <li>
                <a>Lectures</a>
              </li>
              <li>
                <a>Online MIS</a>
              </li>
              <li>
                <a>PENS Editorial</a>
              </li>
            </ol>
          </div>
          <div>
            <p className="text-lg font-semibold">Social</p>
            <ol className="mt-4 gap-x-6 flex">
              <li>
                <a>
                  <ChatBubbleOvalLeftIcon className="size-6" />
                </a>
              </li>
              <li>
                <a>
                  <ChatBubbleOvalLeftIcon className="size-6" />
                </a>
              </li>
              <li>
                <a>
                  <ChatBubbleOvalLeftIcon className="size-6" />
                </a>
              </li>
            </ol>
          </div>
        </div>
        <div className="divider before:bg-gray-300 after:bg-gray-300"></div>
        <p className="text-center text-sm  font-normal">
          © 2019 Lift Media | All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
