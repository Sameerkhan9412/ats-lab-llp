"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../../assets/logo.jpg";

type User = {
  username: string;
  email: string;
};

const ptpLinks = [
  { name: "PTP Introduction", link: "/ptp", desc: "Learn about our PT programs" },
  { name: "PT Calendar", link: "/calender", desc: "View upcoming testing schedules" },
  { name: "Instruction Sheet", link: "/sheet", desc: "Download guidelines & forms" },
  { name: "Registration", link: "/signup", desc: "Join our testing program" },
];

const RMPLinks = [
  { name: "RMP Introduction", link: "/rmp", desc: "Reference material overview" },
  { name: "IP Reference Substance", link: "/iprs", desc: "Browse IPRS catalog" },
];

// NEW: Certificate Links
const certificateLinks = [
  {
    name: "ISO 9001:2015",
    link: "/certificates/iso-9001",
    desc: "Quality Management System",
    icon: "🏆",
  },
  {
    name: "ISO 14001:2015",
    link: "/certificates/iso-14001",
    desc: "Environmental Management System",
    icon: "🌿",
  },
  {
    name: "ISO 45001:2018",
    link: "/certificates/iso-45001",
    desc: "Occupational Health & Safety",
    icon: "🛡️",
  },
  {
    name: "GST Certificate",
    link: "/certificates/gst",
    desc: "Goods and Services Tax Registration",
    icon: "📋",
  },
  {
    name: "Ministry of Corporate Affairs",
    link: "/certificates/mca",
    desc: "MCA Registration & Compliance",
    icon: "🏛️",
  },
  {
    name: "MSME Certificate",
    link: "/certificates/msme",
    desc: "Micro, Small & Medium Enterprise",
    icon: "🏭",
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] py-2"
            : "bg-white/95 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                <Image
                  src={logo}
                  alt="ATAS Logo"
                  className="relative w-11 h-11 rounded-xl object-cover ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  ATAS Laboratories
                </span>
                <span className="text-[10px] font-medium text-blue-600 tracking-widest uppercase">
                  LLP
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {/* Home */}
              <NavLink href="/" active={pathname === "/"}>
                Home
              </NavLink>

              {/* About */}
              <NavLink href="/about" active={pathname === "/about"}>
                About Us
              </NavLink>

              {/* PT Provider Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("ptp")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeDropdown === "ptp" || pathname.startsWith("/ptp")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  PT Provider
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === "ptp" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {activeDropdown === "ptp" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {ptpLinks.map((link, i) => (
                          <Link
                            key={i}
                            href={link.link}
                            className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group"
                          >
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {link.name}
                            </span>
                            <span className="text-xs text-gray-500">{link.desc}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                        <p className="text-white text-sm font-medium">Need help getting started?</p>
                        <Link href="/contact" className="text-blue-100 text-xs hover:text-white transition-colors">
                          Contact our team →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RMP Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("rmp")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeDropdown === "rmp" || pathname.startsWith("/rmp")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  RMP
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === "rmp" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {activeDropdown === "rmp" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {RMPLinks.map((link, i) => (
                          <Link
                            key={i}
                            href={link.link}
                            className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group"
                          >
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {link.name}
                            </span>
                            <span className="text-xs text-gray-500">{link.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* NEW: Certificates Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("certificates")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeDropdown === "certificates" || pathname.startsWith("/certificates")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Our Certificates
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === "certificates" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {activeDropdown === "certificates" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-bold">Our Certifications</h3>
                            <p className="text-blue-100 text-xs">Accredited & Recognized</p>
                          </div>
                        </div>
                      </div>

                      {/* Certificate List */}
                      <div className="p-2 max-h-80 overflow-y-auto">
                        {certificateLinks.map((cert, i) => (
                          <Link
                            key={i}
                            href={cert.link}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group"
                          >
                            <span className="text-2xl">{cert.icon}</span>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors block">
                                {cert.name}
                              </span>
                              <span className="text-xs text-gray-500">{cert.desc}</span>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="p-3 border-t border-gray-100">
                        <Link
                          href="/certificates"
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all"
                        >
                          View All Certificates
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact */}
              <NavLink href="/contact" active={pathname === "/contact"}>
                Contact Us
              </NavLink>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!loading && (
                <>
                  {!user ? (
                    <>
                      <button
                        onClick={() => router.push("/login")}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50 transition-all"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => router.push("/signup")}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push("/dashboard/profile")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{user.username}</span>
                      </button>
                      <button
                        onClick={logout}
                        className="px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 origin-left ${
                    mobileOpen ? "rotate-45 translate-x-px" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                    mobileOpen ? "opacity-0 translate-x-3" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 origin-left ${
                    mobileOpen ? "-rotate-45 translate-x-px" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <span className="text-lg font-bold text-gray-900">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <MobileLink href="/" active={pathname === "/"}>
                    Home
                  </MobileLink>
                  <MobileLink href="/about" active={pathname === "/about"}>
                    About Us
                  </MobileLink>

                  {/* PT Provider */}
                  <div className="pt-4">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      PT Provider
                    </p>
                    {ptpLinks.map((link, i) => (
                      <MobileLink key={i} href={link.link} active={pathname === link.link} sub>
                        {link.name}
                      </MobileLink>
                    ))}
                  </div>

                  {/* RMP */}
                  <div className="pt-4">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      RMP
                    </p>
                    {RMPLinks.map((link, i) => (
                      <MobileLink key={i} href={link.link} active={pathname === link.link} sub>
                        {link.name}
                      </MobileLink>
                    ))}
                  </div>

                  {/* NEW: Certificates Section for Mobile */}
                  <div className="pt-4">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      🏆 Our Certificates
                    </p>
                    {certificateLinks.map((cert, i) => (
                      <MobileLink key={i} href={cert.link} active={pathname === cert.link} sub>
                        <span className="flex items-center gap-2">
                          <span>{cert.icon}</span>
                          <span>{cert.name}</span>
                        </span>
                      </MobileLink>
                    ))}
                    <Link
                      href="/certificates"
                      className="flex items-center gap-2 px-4 py-2 ml-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-xl transition-all"
                    >
                      View All Certificates →
                    </Link>
                  </div>

                  <MobileLink href="/contact" active={pathname === "/contact"}>
                    Contact Us
                  </MobileLink>
                </div>

                {/* Mobile Auth */}
                {!loading && (
                  <div className="p-4 border-t border-gray-100">
                    {!user ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            router.push("/login");
                            setMobileOpen(false);
                          }}
                          className="w-full py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            router.push("/signup");
                            setMobileOpen(false);
                          }}
                          className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                          Sign Up
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              router.push("/dashboard/profile");
                              setMobileOpen(false);
                            }}
                            className="flex-1 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                          >
                            Profile
                          </button>
                          <button
                            onClick={logout}
                            className="flex-1 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Desktop Nav Link Component
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
        active ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeNav"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
        />
      )}
    </Link>
  );
}

// Mobile Nav Link Component
function MobileLink({
  href,
  active,
  sub = false,
  children,
}: {
  href: string;
  active: boolean;
  sub?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-gray-700 hover:bg-gray-50"
      } ${sub ? "text-sm ml-2" : "font-semibold"}`}
    >
      {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
      {children}
    </Link>
  );
}