import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
          Ready to Ensure{" "}
          <span className="text-white/90">Testing Precision?</span>
        </h2>

        <p className="text-white/80 text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of laboratories globally that trust our Proficiency
          Testing programs and Reference Materials for consistent quality
          assurance.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <Link
            href="#contact"
            className="group inline-flex items-center justify-center 
            rounded-full bg-white px-10 py-4
            text-sm font-bold text-blue-600
            shadow-xl transition-all duration-300
            hover:bg-slate-100 hover:shadow-2xl hover:scale-[1.03]"
          >
            Get Started Today
          </Link>

          <Link
            href="/contact"
            className="group inline-flex items-center justify-center 
            rounded-full border border-white/40 
            bg-white/10 px-10 py-4
            text-sm font-bold text-white
            backdrop-blur-md
            transition-all duration-300
            hover:bg-white hover:text-blue-600 hover:shadow-xl hover:scale-[1.03]"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
