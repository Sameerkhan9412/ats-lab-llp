"use client";

import Link from "next/link";
import {
  FileText,
  Download,
  Sparkles,
  ArrowUpRight,
  ClipboardList,
  ClipboardPenLine,
  ShieldCheck,
} from "lucide-react";

// ✅ Files in public folder are accessible from root "/"
const ptTestForm = "/docs/pt-test-form.doc";
const registrationForm = "/docs/registration-form.docx";
const resultSubmissionForm = "/docs/result-submission.docx";

const FORMS = [
  {
    title: "PT Test Form",
    description:
      "Download the official PT Test Form required for participating in proficiency testing cycles.",
    href: ptTestForm,
    buttonLabel: "Download Form",
    accent: "from-[#00B4D8] to-[#90E0EF]",
    icon: ClipboardList,
    external: true,
    fileType: "DOC document",
  },
  {
    title: "Registration Form",
    description:
      "Download and fill this registration form to enroll in our PT programs.",
    href: registrationForm,
    buttonLabel: "Download Form",
    accent: "from-violet-500 to-violet-300",
    icon: ClipboardPenLine,
    external: true,
    fileType: "PDF document",
  },
  {
    title: "Result Submission",
    description:
      "Access the admin panel to upload, review, and manage participant results securely.",
    href: resultSubmissionForm,
    buttonLabel: "Go to Admin Panel",
    accent: "from-emerald-500 to-emerald-300",
    icon: ShieldCheck,
    external: false,
    fileType: "Admin Panel",
  },
];

export default function DownloadFormsPage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* ─── PAGE HEADER ─── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Download Forms
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Access official documents for PT registration, testing, and
                result submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/pt-programs"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              Explore PT Programs
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          </div>
        </div>

        {/* ─── INFO STRIP ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] px-5 py-4">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center">
                <Download className="w-4 h-4 text-[#90E0EF]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">
                  Official PT Documentation
                </p>
                <p className="text-[11px] text-slate-500">
                  All forms are provided in PDF/DOC format. Please download, fill,
                  and submit as per instructions provided by your coordinator.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Need help?{" "}
              <span className="text-slate-300 font-semibold">
                Contact support for submission guidance.
              </span>
            </p>
          </div>
        </div>

        {/* ─── FORMS GRID ─── */}
        <div className="grid md:grid-cols-3 gap-5">
          {FORMS.map((form) => {
            const Icon = form.icon;
            return (
              <div
                key={form.title}
                className="group relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-0.5"
              >
                {/* Glow */}
                <div
                  className={`absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl bg-gradient-to-br ${form.accent}`}
                />

                <div className="relative space-y-4">
                  {/* Icon + Title */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${form.accent} flex items-center justify-center shadow-lg shadow-black/30`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          {form.title}
                        </h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {form.fileType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {form.description}
                  </p>

                  {/* Action */}
                  <div className="pt-1">
                    {form.external ? (
                      <a
                        href={form.href}
                        download // ✅ Add download attribute for direct download
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 hover:text-[#90E0EF] transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {form.buttonLabel}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={form.href}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {form.buttonLabel}
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── FOOTNOTE ─── */}
        <p className="text-[11px] text-slate-500 text-center pt-4">
          Ensure you are using the latest version of the forms before
          submission. Older versions may not be accepted.
        </p>
      </div>
    </div>
  );
}