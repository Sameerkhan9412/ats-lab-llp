"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/* ================== TYPES ================== */

type Slide = {
  image: string;
  heading1: [string, string];
  heading2: string;
  heading3: string;
};

/* ================== ANIMATIONS ================== */

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // TS-safe easing
    },
  },
};

/* ================== SLIDES DATA ================== */

const imgs: Slide[] = [
  {
    image: "https://assurancetestingservices.in/assets/images/10.jpg",
    heading1: ["Delivering Reliable", "Analytical Excellence"],
    heading2: "Accurate Testing Backed by Advanced Laboratory Systems",
    heading3:
      "We support industries and institutions with precise, compliant, and dependable analytical services aligned with national and international quality standards.",
  },
  {
    image: "https://assurancetestingservices.in/assets/images/Lab_Setup.jpg",
    heading1: ["State-of-the-Art", "Lab Infrastructure"],
    heading2: "Precision Instruments for Accurate & Reproducible Results",
    heading3:
      "Our laboratories feature modern analytical instruments and controlled environments to ensure accuracy, repeatability, and regulatory compliance.",
  },
  {
    image: "https://assurancetestingservices.in/assets/images/drinkingwater.jpg",
    heading1: ["Water & Env.", "Testing Services"],
    heading2: "Ensuring Safety, Quality, and Regulatory Compliance",
    heading3:
      "Comprehensive water and environmental testing services supporting public health, sustainability, and adherence to applicable standards.",
  },
];

/* ================== COMPONENT ================== */

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="relative w-full min-h-[75vh] md:min-h-[85vh] max-h-screen overflow-hidden">
      {/* Navigation Buttons */}
      <button className="swiper-button-prev group absolute left-6 top-1/2 -translate-y-1/2 z-20 
        flex h-12 w-12 items-center justify-center rounded-full 
        bg-white/15 backdrop-blur-md hover:bg-white/30 transition">
        <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition" />
      </button>

      <button className="swiper-button-next group absolute right-6 top-1/2 -translate-y-1/2 z-20 
        flex h-12 w-12 items-center justify-center rounded-full 
        bg-white/15 backdrop-blur-md hover:bg-white/30 transition">
        <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition" />
      </button>

      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        onSlideChange={(swiper: SwiperClass) =>
          setActiveIndex(swiper.realIndex)
        }
        className="h-full w-full"
      >
        {imgs.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            {/* Background */}
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Content */}
            <motion.div
              key={activeIndex}
              variants={container}
              initial="hidden"
              animate="show"
              // className="relative z-10 flex h-full max-w-7xl mx-auto px-6 items-center"
              className="relative z-10 flex min-h-[75vh] md:min-h-[85vh] max-w-7xl mx-auto px-6 items-center"
            >
              <div className="max-w-2xl text-white space-y-4">
                <motion.h1
                  variants={item}
                  className="text-4xl md:text-6xl font-extrabold leading-tight"
                >
                  {slide.heading1[0]} <br />
                  <span className="text-blue-400">
                    {slide.heading1[1]}
                  </span>
                </motion.h1>

                <motion.h2
                  variants={item}
                  className="text-lg md:text-2xl text-gray-200"
                >
                  {slide.heading2}
                </motion.h2>

                <motion.p
                  variants={item}
                  className="text-sm md:text-base text-gray-300 leading-relaxed"
                >
                  {slide.heading3}
                </motion.p>

                <motion.div
                  variants={item}
                  className="flex flex-wrap gap-4 text-sm text-gray-300 pt-2"
                >
                  <span>ISO / NABL Aligned</span>
                  <span>•</span>
                  <span>Regulatory Compliant</span>
                  <span>•</span>
                  <span>Trusted by Laboratories</span>
                </motion.div>

                <motion.div variants={item} className="flex gap-4 pt-3">
                  <button className="rounded-lg bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700 transition shadow-lg">
                    Get Started
                  </button>
                  <button className="rounded-lg border border-white/40 px-7 py-3 hover:bg-white/10 transition">
                    Learn More
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
