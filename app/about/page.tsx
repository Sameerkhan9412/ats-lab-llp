"use client";

import Image from "next/image";
import Link from "next/link";
import img from "@/app/assets/gallary1.png"; // reuse existing image

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220] text-white">
      {/* HERO */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0">
          <Image
            src={img}
            alt="ATS Laboratories"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex mb-4 items-center rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            About Us
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            ATS Laboratories LLP
          </h1>

          <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A trusted laboratory platform delivering accuracy, compliance,
            and confidence through proficiency testing, reference materials,
            and advanced laboratory solutions.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {/* WHO WE ARE */}
        <Card title="Who We Are">
          <p>
            <strong className="text-cyan-400">ATS Laboratories LLP</strong> is a
            professionally managed laboratory organization committed to
            supporting testing and calibration laboratories across India.
            We help laboratories maintain compliance, accuracy, and confidence
            through structured proficiency testing programs and reference
            materials.
          </p>
        </Card>

        {/* OUR MISSION */}
        <Card title="Our Mission">
          <p>
            To strengthen laboratory quality systems by providing reliable,
            transparent, and technically sound proficiency testing and
            reference material programs aligned with national and
            international standards.
          </p>
        </Card>

        {/* WHAT WE OFFER */}
        <Card title="What We Offer">
          <ul className="grid sm:grid-cols-2 gap-4 list-disc list-inside text-slate-300">
            <li>Proficiency Testing Programs (PTP)</li>
            <li>Reference Materials & Substances (RMP)</li>
            <li>Compliance & Quality Assurance Support</li>
            <li>Secure Digital Reporting & Dashboards</li>
            <li>Transparent Evaluation & Performance Reports</li>
          </ul>
        </Card>

        {/* WHY CHOOSE US */}
        <Card title="Why Choose ATS Laboratories">
          <div className="grid sm:grid-cols-2 gap-6 text-slate-300">
            <Feature
              title="Accuracy & Reliability"
              desc="Programs designed with technical rigor and statistical integrity."
            />
            <Feature
              title="Compliance Driven"
              desc="Aligned with NABL, ISO and regulatory expectations."
            />
            <Feature
              title="Secure Platform"
              desc="End-to-end encrypted access to reports and submissions."
            />
            <Feature
              title="Expert Support"
              desc="Backed by experienced laboratory professionals."
            />
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg
            bg-gradient-to-r from-cyan-400 to-cyan-500 px-8 py-3
            font-bold text-[#08121f] hover:brightness-110 transition shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ------------------ UI HELPERS ------------------ */

function Card({ title, children }: any) {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h2>
      <div className="text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm">{desc}</p>
    </div>
  );
}
