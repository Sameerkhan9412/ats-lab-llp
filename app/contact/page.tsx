"use client";

import Image from "next/image";
import img from "@/app/assets/gallary3.png";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220] text-white">
      {/* HERO */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0">
          <Image
            src={img}
            alt="Contact ATS Laboratories"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex mb-4 items-center rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Contact Us
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5">
            Get in Touch with ATS Laboratories LLP
          </h1>

          <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Have questions about proficiency testing, reference materials,
            or platform access? Our team is here to help.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-10">
        {/* CONTACT INFO */}
        <div className="space-y-6">
          <InfoCard title="Office Address">
            ATS Laboratories LLP <br />
            Khasra No 136, Viklang Colony, Nandgram, Ghaziabad <br />
            U.P, India
          </InfoCard>

          <InfoCard title="Email">
            <p className="text-cyan-400 font-medium">
              support@atslaboratories.com
            </p>
          </InfoCard>

          <InfoCard title="Phone">
            <p>+91-8447959568, +91-8307200789</p>
          </InfoCard>

          <InfoCard title="Working Hours">
            Monday – Friday <br />
            9:30 AM – 6:00 PM
          </InfoCard>
        </div>

        {/* CONTACT FORM */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            Send Us a Message
          </h2>

          <form className="space-y-5">
            <Input label="Full Name" placeholder="Enter your name" />
            <Input label="Email Address" placeholder="you@example.com" />
            <Input label="Phone (Optional)" placeholder="+91 XXXXXXXX" />

            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Write your message here..."
                className="w-full rounded-lg bg-[#131b2e]
                border border-slate-700 px-4 py-3 text-sm outline-none
                focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-gradient-to-r
              from-cyan-400 to-cyan-500 py-3 font-bold
              text-[#08121f] hover:brightness-110 transition shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function InfoCard({ title, children }: any) {
  return (
    <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
      <h3 className="text-sm font-semibold text-cyan-400 mb-1">
        {title}
      </h3>
      <div className="text-slate-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Input({ label, placeholder }: any) {
  return (
    <div>
      <label className="block mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full rounded-lg bg-[#131b2e]
        border border-slate-700 px-4 py-3 text-sm outline-none
        focus:ring-2 focus:ring-cyan-400 transition"
      />
    </div>
  );
}
