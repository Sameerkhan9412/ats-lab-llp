"use client";

import Image from "next/image";
import React from "react";
import aboutImg from "@/app/assets/about.png";
import Link from "next/link";

const About = () => {
  return (
    <section
      id="about"
      className="relative py-8 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-x-0 -top-32 flex justify-center pointer-events-none">
        <div className="w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* IMAGE SIDE */}
          <div className="w-full lg:w-1/2 relative group">
            {/* Glow */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl" />

            <div
              className="relative rounded-3xl overflow-hidden 
              border border-white/60 bg-white/40 backdrop-blur
              shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]
              transition-transform duration-500 group-hover:scale-[1.02]"
            >
              <Image
                src={aboutImg}
                alt="ATS Laboratories facility"
                width={600}
                height={450}
                className="object-cover"
                priority
              />
            </div>

            {/* Experience Badge */}
            <div
              className="absolute -bottom-6 -right-6 
              bg-gradient-to-br from-blue-600 to-cyan-500 
              px-6 py-5 rounded-2xl shadow-xl text-white hidden md:block"
            >
              <p className="text-3xl font-extrabold leading-none">15+</p>
              <p className="mt-1 text-xs uppercase tracking-widest font-semibold opacity-90">
                Years Experience
              </p>
            </div>
          </div>

          {/* CONTENT SIDE */}
          <div className="w-full lg:w-1/2">
            {/* Label */}
            <span
              className="inline-flex items-center gap-2 mb-5 
              rounded-full bg-blue-50 px-5 py-2 
              text-xs font-semibold tracking-widest uppercase 
              text-blue-600"
            >
              Our Commitment
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-800 mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                ATS Laboratories LLP
              </span>
            </h2>

            {/* Text */}
            <p className="text-slate-600 mb-5 leading-relaxed text-base md:text-lg">
              ATS Laboratories LLP plays a vital role in providing confidence to
              laboratories in their testing and measurement results. We assess
              the ability of laboratories to competently perform specific tests
              and measurements.
            </p>

            <p className="text-slate-600 mb-10 leading-relaxed">
              We continuously expand our proficiency testing programs across
              Chemical, Mechanical, Biological, Construction Materials, Textile,
              Paint, and more — with strict adherence to ISO standards.
            </p>

            {/* Points */}
            <ul className="grid grid-cols-2 gap-5 mb-12">
              {[
                "ISO 17034 Certified",
                "Global Recognition",
                "100% Confidential",
                "Expert Support",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <span className="material-icons text-blue-600 text-xl">
                    check_circle
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/about" // ya "#about" ya "/profile"
              className="group inline-flex items-center gap-3 
  rounded-full border border-slate-200 
  bg-slate-900 px-9 py-4
  text-sm font-bold text-white
  transition-all duration-300
  hover:bg-white hover:text-blue-600
  hover:shadow-xl focus:outline-none"
            >
              <span className="transition-colors duration-300">
                View Full Profile
              </span>

              <span
                className="material-icons transition-transform duration-300 
    group-hover:translate-x-1"
              >
                open_in_new
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
