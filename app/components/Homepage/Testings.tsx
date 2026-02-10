"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import img1 from "@/app/assets/image.png";
import img2 from "@/app/assets/image2.png";
import img3 from "@/app/assets/image3.png";
import img4 from "@/app/assets/image4.png";
import img5 from "@/app/assets/image5.png";
import img6 from "@/app/assets/image6.png";

const Testings = () => {
  return (
    <main className="bg-white text-slate-800">
      {/* ================= PROFIENCY TESTING ================= */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-block mb-4 px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-full bg-blue-50 text-blue-700">
            Proficiency Testing
          </span>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl 
    font-extrabold tracking-tight text-slate-800"
          >
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Independent Performance Evaluation
            </span>
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Our Proficiency Testing Programs are designed to objectively assess
            laboratory competence, accuracy, and consistency in accordance with
            national and international quality requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Program Registration",
              desc: "A structured and transparent registration process ensuring correct participation, documentation, and program allocation.",
              img: img1,
              btn: "View Registration Process",
            },
            {
              title: "Ongoing PT Programs",
              desc: "Currently active proficiency testing programs covering multiple testing domains and matrices.",
              img: img2,
              btn: "View Ongoing Programs",
            },
            {
              title: "Upcoming PT Programs",
              desc: "Planned proficiency testing schemes developed to address emerging regulatory and technical needs.",
              img: img3,
              btn: "View Program Schedule",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden
              transition hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-52">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {item.title}
                  </span>
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8">
                  {item.desc}
                </p>

                <Link
                  href="#"
                  className="inline-flex items-center justify-center
                  w-full rounded-md border border-blue-700
                  px-6 py-3 text-sm font-semibold text-blue-700
                  transition hover:bg-blue-700 hover:text-white"
                >
                  {item.btn}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRAINING SERVICES ================= */}
      <section className="py-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-20 items-center">
          <Image
            src={img4}
            alt="Laboratory training"
            width={600}
            height={450}
            className="rounded-2xl shadow-lg object-cover lg:col-span-2"
          />

          <div className="lg:col-span-3">
            <span className="inline-block mb-2 px-4 py-1.5 text-xs font-semibold uppercase rounded-full bg-blue-100 text-blue-700">
              Training & Competence
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Laboratory Training Services
              </span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-xl">
              Our training programs are developed to strengthen laboratory
              personnel competence, quality system implementation, and
              regulatory understanding.
            </p>

            <ul className="space-y-4 mb-6 flex flex-col">
              {[
                "Technical testing and analytical skills",
                "Management system and ISO standard training",
                "Statistical analysis and data interpretation",
                "Regulatory and compliance awareness programs",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-700" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="#"
              className="inline-flex rounded-md bg-blue-700 px-8 py-3
              text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Explore Training Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ================= QUALITY CONTROL ================= */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-20 items-center">
          <div className="lg:col-span-3">
            <span className="inline-block mb-2 px-4 py-1.5 text-xs font-semibold uppercase rounded-full bg-blue-100 text-blue-700">
              Quality Assurance
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Quality Control Materials
              </span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-xl">
              Quality Control materials prepared from retained PT items are
              intended for internal monitoring, troubleshooting, and long-term
              performance evaluation of laboratory testing processes.
            </p>

            <Link
              href="#"
              className="inline-flex rounded-md bg-blue-700 px-8 py-3
              text-sm font-bold text-white transition hover:bg-blue-800"
            >
              View Available QC Materials
            </Link>
          </div>

          <Image
            src={img6}
            alt="Quality control laboratory"
            width={600}
            height={450}
            className="rounded-2xl shadow-xl object-cover col-span-2"
          />
        </div>
      </section>

      {/* ================= CERTIFIED REFERENCE MATERIALS ================= */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-20 items-center">
          <Image
            src={img5}
            alt="Certified Reference Materials"
            width={600}
            height={600}
            className="rounded-2xl shadow-xl object-cover col-span-2"
          />

          <div className="lg:col-span-3">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Certified Reference Materials
              </span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-xl">
              We develop and supply Certified Reference Materials (CRMs) with
              defined traceability, homogeneity, and stability to support
              accurate calibration, validation, and quality assurance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                "Metrological traceability to SI units",
                "Compliance with ISO requirements",
                "Batch-specific certification",
                "Technical guidance and support",
              ].map((item) => (
                 <li
                  key={item}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-700" />
                  {item}
                </li>
              ))}
            </div>

            <Link
              href="#"
              className="inline-flex rounded-md border border-blue-700
              px-8 py-3 text-sm font-bold text-blue-700
              transition hover:bg-blue-700 hover:text-white"
            >
              View Reference Material Catalogue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Testings;
