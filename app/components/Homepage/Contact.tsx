"use client";

import React from "react";

const Contact = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
          bg-cyan-100 text-cyan-700 text-xs font-semibold uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-sm">
            support_agent
          </span>
          Technical Assistance
        </span>

        <h1 className="mt-4 text-4xl font-extrabold text-slate-900">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Get in Touch
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Our technical team provides professional support for global laboratory
          operations. Reach out for proficiency testing inquiries or laboratory
          certification assistance.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
          <form className="space-y-6">
            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  label: "Customer Name",
                  icon: "person",
                  placeholder: "John Doe",
                },
                {
                  label: "Company Name",
                  icon: "business",
                  placeholder: "Lab Systems International",
                },
                {
                  label: "Contact Number",
                  icon: "call",
                  placeholder: "+1 (555) 000-0000",
                },
                {
                  label: "Email Address",
                  icon: "mail",
                  placeholder: "contact@company.com",
                },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    {f.label}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600">
                      {f.icon}
                    </span>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 
                      border border-slate-200 focus:ring-2 focus:ring-cyan-400 
                      focus:border-cyan-400 outline-none transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Select */}
            <div>
              <label className="block mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Technical Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg bg-slate-50 
                border border-slate-200 focus:ring-2 focus:ring-cyan-400 
                focus:border-cyan-400 outline-none transition"
              >
                <option>General Inquiry</option>
                <option>PT Scheme Registration</option>
                <option>Technical Validation</option>
                <option>Lab Certification Support</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Message / Inquiry
              </label>
              <textarea
                rows={4}
                placeholder="Please describe how our technical team can assist you..."
                className="w-full px-4 py-3 rounded-lg bg-slate-50 
                border border-slate-200 focus:ring-2 focus:ring-cyan-400 
                focus:border-cyan-400 outline-none transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 
              bg-cyan-500 text-white font-bold rounded-lg 
              hover:bg-cyan-600 transition shadow-md"
            >
              Submit Request
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* Office */}
          <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3">
              <span className="material-symbols-outlined text-cyan-600">
                location_on
              </span>
              Main Office
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
             Khasra No 136, Viklang Colony, Nandgram
              <br />
              Ghaziabad, (U.P.)
              <br />
              India
            </p>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
              <span className="material-symbols-outlined text-cyan-600">
                contact_support
              </span>
              Quick Support
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-cyan-600">
                  alternate_email
                </span>
                support@globalpt.com
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-cyan-600">
                  forum
                </span>
                Available 24/5 GMT
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
    relative rounded-2xl bg-white
    border border-slate-200
    shadow-[0_6px_18px_rgba(0,0,0,0.08)]
    transition-all duration-300
    hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
  "
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex gap-2 items-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    account_balance
                  </span>
                  <h2 className="text-lg font-bold">
                    Electronic Fund Transfer Details
                  </h2>
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-md">
                Use these details for PT registration fees and technical service
                payments.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              Secure Payment Channel
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Item */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Bank Name
              </p>
              <p className="text-sm font-bold text-slate-900">
                GLOBAL TECH BANK N.A.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                SWIFT / BIC Code
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 font-mono">
                  GTBNAUS33XXX
                </p>
                <button
                  className="p-1 rounded hover:bg-slate-100 transition"
                  title="Copy"
                >
                  <span className="material-symbols-outlined text-sm text-slate-500">
                    content_copy
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Account Holder
              </p>
              <p className="text-sm font-bold text-slate-900">
                GLOBAL PT PROVIDER LTD.
              </p>
            </div>

            {/* Highlighted but still clean */}
            <div className="space-y-1 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Account Number (IBAN)
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-900 font-mono truncate">
                  US12 9900 4455 0000 8877 66
                </p>
                <button
                  className="
              px-3 py-1.5 rounded-md
              bg-primary text-white text-[11px] font-semibold
              hover:opacity-90 transition
            "
                >
                  COPY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">
                verified
              </span>
              PCI DSS COMPLIANT
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">lock</span>
              256-BIT ENCRYPTION
            </div>
          </div>

          <button className="text-xs font-semibold text-primary hover:underline underline-offset-4 flex items-center gap-1">
            Download Payment Instructions (PDF)
            <span className="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Contact;
