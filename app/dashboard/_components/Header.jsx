"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

function Header() {
  const path = usePathname();

  return (
    <div className="flex p-4 items-center justify-between bg-gray-300/20 backdrop-blur-lg shadow-md rounded-b-2xl">
      <Image src={"/logo.svg"} width={100} height={100} />
      <ul className="flex gap-6">
        <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
          Dashboard
        </li>
        <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
          Questions
        </li>
        <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
          Upgrade
        </li>
        <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
          How It Works?
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
