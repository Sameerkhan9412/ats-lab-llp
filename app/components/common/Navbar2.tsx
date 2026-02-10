"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

import logo from "../../assets/logo.jpg";
import Image from "next/image";
const ptpLinks = [
  { name: "PTP Introduction", link: "ptp" },
  { name: "PT Calender", link: "#" },
  { name: "Instruction Sheet", link: "#" },
  { name: "Registration", link: "/signup" },
];

const RMPLinks = [
  { name: "RMP Introduction", link: "rmp" },
  { name: "IP Reference Substance (IPRS)", link: "#" },
  { name: "IP Reference Substance (IPRS)", link: "#" },
];
export default function Navbar() {
  return (
    <header className="w-full bg-white fixed top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className=" font-bold text-blue-500 flex items-center gap-2 md:text-2xl">
            <Image src={logo} className="scale-150 w-8 mx-2" alt="logo" />
            ATS Laboratories LLP
          </span>
        </Link>

        {/* Navigation */}
        <NavigationMenu className="relative font-semibold">
          <NavigationMenuList className="text-blue-500 font-semibold">
            <NavigationMenuItem className="text-blue-500">
              <NavigationMenuLink className="text-blue-500">
                <Link href={"/"} className="hover:text-blue-600 hover:underline">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="text-blue-500">
              <NavigationMenuLink className="text-blue-500">
                <Link href={"/about"} className="hover:text-blue-600 hover:underline">About Us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Products */}
            <NavigationMenuItem className="">
              <NavigationMenuTrigger className="text-blue-500">
                <Link href={"/PT"} className="hover:text-blue-600">PT Provider</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white">
                <ul className="w-56 space-y-2 text-sm text-blue-500">
                  {ptpLinks.map((pt, index) => (
                    <li className="cursor-pointer hover:bg-blue-950 rounded-md py-1 px-2">
                      <Link href={`/${pt.link}`}>{pt.name}</Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Resources */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-blue-500">
                RMP
              </NavigationMenuTrigger>
              <NavigationMenuContent className="text-blue-500 bg-white">
                <ul className="w-56 space-y-2 text-sm">
                  {RMPLinks.map((rm, index) => (
                    <li className="cursor-pointer hover:bg-blue-950 rounded-md py-1 px-2">
                      <Link href={`/${rm.link}`}>{rm.name}</Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

             <NavigationMenuItem className="text-blue-500">
              <NavigationMenuLink className="text-blue-500">
                <Link href={"/about"}>About Us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          {/* 🔑 THIS IS REQUIRED */}
          <NavigationMenuViewport className="absolute left-0 top-full mt-2" />
        </NavigationMenu>

        {/* Auth */}
        <div className="flex gap-3">
          <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white cursor-pointer">
            Login
          </Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white cursor-pointer">Sign up</Button>
        </div>
      </div>
    </header>
  );
}
