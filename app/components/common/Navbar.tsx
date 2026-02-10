"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

type User = {
  username: string;
  email: string;
};

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
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/auth/me", {
            credentials: "include",
            cache: "no-store"
          });
          const data = await res.json();
         setUser(data.user ?? null);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="ATS Logo" className="w-9 h-9" />
          <span className="text-lg md:text-xl font-extrabold text-blue-600">
            ATS Laboratories LLP
          </span>
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex gap-6 font-semibold text-slate-700">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="hover:text-blue-600 transition">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className="hover:text-blue-600 transition">
                  About Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>PT Provider</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white shadow-lg rounded-xl p-2">
                <ul className="w-56 space-y-1 text-sm">
                  {
                    ptpLinks.map((link,index)=>(
                       <li>
                    <Link
                      href={link.link}
                      className="block px-3 py-2 hover:bg-blue-500"
                    >
                      {link.name}
                    </Link>
                  </li>
                    ))
                  }
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>RMP</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white shadow-lg rounded-xl p-2">
                <ul className="w-56 space-y-1 text-sm">
                  {
                    RMPLinks.map((link,index)=>(
                      <li>
                      <Link
                        href={link.link}
                        className="block px-3 py-2 hover:bg-blue-500"
                      >
                        {link.name}
                      </Link>
                  </li>
                    ))
                  }
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className="hover:text-blue-600 transition">
                  Contact Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuViewport className="mt-2" />
        </NavigationMenu>

        {/* Auth Buttons */}
        {!loading && (
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
                <Button
                  className="bg-blue-600 text-white"
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  Profile
                </Button>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
