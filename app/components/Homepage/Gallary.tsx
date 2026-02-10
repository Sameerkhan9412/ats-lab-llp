"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import gal1 from "@/app/assets/gallary1.png"
import gal2 from "@/app/assets/gallary2.png"
import gal3 from "@/app/assets/gallary3.png"
import gal4 from "@/app/assets/gallary4.png"
import gal5 from "@/app/assets/gallary5.png"
import gal6 from "@/app/assets/gallary6.png"
const Gallary = () => {
  return (
    <section
      id="gallery"
      className="relative py-28 bg-slate-950 text-white overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block mb-4 px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 text-blue-400">
            Our Work Culture
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Our Gallery
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg">
            A glimpse into our laboratories, expert teams, global collaborations,
            and professional engagements.
          </p>

          <div className="mt-6 w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {/* ROW 1 */}
  <GalleryCard
    title="Team Workshop 2023"
    src={gal1}
    className="md:col-span-1"
  />

  <GalleryCard
    title="Annual General Meeting – Delhi"
    src={gal2}
    className="md:col-span-2"
  />

  <GalleryCard
    title="Quality Assurance Team"
    src={gal3}
    className="md:col-span-1"
  />

  {/* ROW 2 */}
  <GalleryCard
    title="Global PT Seminar"
    src={gal6}
    className="md:col-span-1"
  />

  <GalleryCard
    title="CSIR-NPL Technical Committee"
    src={gal4}
    className="md:col-span-2"
  />

  <GalleryCard
    title="Internal Staff Training"
    src={gal5}
    className="md:col-span-1"
  />
</div>

      </div>
    </section>
  );
};

export default Gallary;

/* ---------------- CARD ---------------- */

function GalleryCard({
  src,
  title,
  className = "",
}: {
  src: StaticImageData;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800
      transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${className}`}
    >
      <Image
        src={src}
        alt={title}
        width={600}
        height={500}
        className="h-80 w-full object-cover opacity-80 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-6">
        <p className="text-sm font-semibold tracking-wide">{title}</p>
      </div>
    </div>
  );
}
