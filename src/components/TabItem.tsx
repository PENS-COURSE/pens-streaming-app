import { Tab } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

const TabItem = ({
  active,
  children,
  hidden,
}: {
  active: boolean;
  hidden?: boolean;
  children: React.ReactNode;
}) => {
  return hidden ? null : (
    <Tab
      className={clsx(
        "w-full text-left px-5 py-2 border-l-[3px]",
        {
          "border-blue-600 bg-gray-800": active,
        },
        {
          "border-transparent": !active,
        }
      )}
    >
      {children}
    </Tab>
  );
};

export default TabItem;
