"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="flex p-4 items-center justify-between bg-black backdrop-blur-lg shadow-md rounded-b-2xl">
      <Image
        src="/logo.svg"
        alt="logo"
        width={150}
        height={40}
        style={{
          width: "auto",
          height: "40px",
        }}
        priority
      />
      <ul className="hidden md:flex gap-6">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == "/dashboard" && "text-primary font-bold"}
            `}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == "/dashboard/questions" && "text-primary font-bold"}
            `}
        >
          Questions
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == "/dashboard/upgrade" && "text-primary font-bold"}
            `}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == "/dashboard/how" && "text-primary font-bold"}
            `}
        >
          How It Works?
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
