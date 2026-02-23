import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-[#0b1220] border-t border-slate-200 pt-20 pb-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src={logo} alt="ATAS Logo" className="w-9 h-9" />
              <span className="text-lg font-extrabold text-blue-600">
                ATAS Laboratories LLP
              </span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Providing confidence through rigorous proficiency testing and
              high-quality reference materials. Your trusted partner in
              laboratory excellence.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-4">
              {["facebook", "language", "alternate_email"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 rounded-full 
                  bg-white border border-slate-200 
                  flex items-center justify-center
                  text-slate-500
                  transition-all duration-300
                  hover:bg-blue-600 hover:text-white hover:border-blue-600"
                >
                  <span className="material-icons text-lg">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-slate-600 font-bold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                "Services Portfolio",
                "Ongoing PT Programs",
                "Quality Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-blue-600 transition text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-slate-600 font-bold mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              {[
                "Download Catalog",
                "Registration Form",
                "CRM List 2024",
                "FAQ Center",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-blue-600 transition text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-slate-600 font-bold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="material-icons text-blue-600">
                  location_on
                </span>
                <span>
                 Khasra No 136, Viklang Colony, Nandgram, Ghaziabad, (U.P.)- 201001
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="material-icons text-blue-600">
                  phone
                </span>
                +91 (11) 2345-6789
              </li>

              <li className="flex items-center gap-3">
                <span className="material-icons text-blue-600">
                  email
                </span>
                info@atslaboratories.com
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} ATAS Laboratories LLP. All rights reserved.
          </p>

          <div className="flex gap-6">
            {["Privacy Policy", "Cookies", "Sitemap"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-slate-500 text-xs hover:text-blue-600 transition"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
