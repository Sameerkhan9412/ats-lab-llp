"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  UserCog,
  Building2,
  MapPin,
  CreditCard,
  Truck,
  Phone,
  Settings2,
  Upload,
  GraduationCap,
  Save,
  Loader2,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  X,
  FileUp,
  FileCheck,
  Trash2,
  Globe,
  Hash,
  Mail,
  Smartphone,
  Briefcase,
  Award,
  Link2,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  Info,
  CircleDot,
  RotateCcw,
  Eye,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const DISCIPLINES = [
  "Chemical (Testing)",
  "Mechanical (Testing)",
  "Non Destructive Testing",
  "Biological (Testing)",
  "Electrical (Testing)",
  "Mechanical (Calibration)",
];

const SECTIONS = [
  { id: "participant", label: "Participant", icon: Building2 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "other", label: "Other Details", icon: Settings2 },
  { id: "uploads", label: "Uploads", icon: Upload },
  { id: "disciplines", label: "Disciplines", icon: GraduationCap },
];

const INITIAL_PROFILE = {
  participant: {
    name: "",
    address1: "",
    address2: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    gstin: "",
    tan: "",
    pan: "",
  },
  billing: {
    sameAsParticipant: false,
    companyName: "",
    address1: "",
    address2: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    gstin: "",
    tan: "",
    pan: "",
  },
  shipping: {
    sameAs: "participant",
    personName: "",
    address1: "",
    address2: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
  },
  contact: {
    name: "",
    mobile: "",
    email: "",
    alternateEmail: "",
  },
  other: {
    designation: "",
    accreditationBy: "",
    website: "",
    certificateNo: "",
  },
  disciplines: [] as string[],
  uploads: {
    gstCertificate: null as File | string | null,
    accreditationCertificate: null as File | string | null,
  },
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
];

export default function UpdateProfilePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("participant");
  const [isNewProfile, setIsNewProfile] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Existing uploaded file URLs (from server)
  const [existingUploads, setExistingUploads] = useState<{
    gstCertificate: string | null;
    accreditationCertificate: string | null;
  }>({
    gstCertificate: null,
    accreditationCertificate: null,
  });

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    participant: useRef<HTMLDivElement>(null),
    billing: useRef<HTMLDivElement>(null),
    shipping: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
    other: useRef<HTMLDivElement>(null),
    uploads: useRef<HTMLDivElement>(null),
    disciplines: useRef<HTMLDivElement>(null),
  };

  const [profileData, setProfileData] = useState<any>({
    ...INITIAL_PROFILE,
  });

  // ─── FETCH EXISTING PROFILE ───
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();

        if (data?.profile) {
          const p = data.profile;
          setIsNewProfile(false);

          setProfileData({
            participant: {
              name: p.participant?.name || "",
              address1: p.participant?.address1 || "",
              address2: p.participant?.address2 || "",
              country: p.participant?.country || "India",
              state: p.participant?.state || "",
              city: p.participant?.city || "",
              pincode: p.participant?.pincode || "",
              gstin: p.participant?.gstin || "",
              tan: p.participant?.tan || "",
              pan: p.participant?.pan || "",
            },
            billing: {
              sameAsParticipant: p.billing?.sameAsParticipant || false,
              companyName: p.billing?.companyName || "",
              address1: p.billing?.address1 || "",
              address2: p.billing?.address2 || "",
              country: p.billing?.country || "India",
              state: p.billing?.state || "",
              city: p.billing?.city || "",
              pincode: p.billing?.pincode || "",
              gstin: p.billing?.gstin || "",
              tan: p.billing?.tan || "",
              pan: p.billing?.pan || "",
            },
            shipping: {
              sameAs: p.shipping?.sameAs || "participant",
              personName: p.shipping?.personName || "",
              address1: p.shipping?.address1 || "",
              address2: p.shipping?.address2 || "",
              country: p.shipping?.country || "India",
              state: p.shipping?.state || "",
              city: p.shipping?.city || "",
              pincode: p.shipping?.pincode || "",
            },
            contact: {
              name: p.contact?.name || "",
              mobile: p.contact?.mobile || "",
              email: p.contact?.email || "",
              alternateEmail: p.contact?.alternateEmail || "",
            },
            other: {
              designation: p.other?.designation || "",
              accreditationBy: p.other?.accreditationBy || "",
              website: p.other?.website || "",
              certificateNo: p.other?.certificateNo || "",
            },
            disciplines: p.disciplines || [],
            uploads: {
              gstCertificate: null,
              accreditationCertificate: null,
            },
          });

          // Store existing upload URLs
          setExistingUploads({
            gstCertificate: p.uploads?.gstCertificate || null,
            accreditationCertificate:
              p.uploads?.accreditationCertificate || null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setFetching(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchProfile();
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      for (const section of SECTIONS) {
        const ref = sectionRefs[section.id];
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs[id]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(id);
  };

  const handleChange = (section: string, field: string, value: any) => {
    setHasChanges(true);
    setProfileData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const toggleDiscipline = (value: string) => {
    setHasChanges(true);
    setProfileData((prev: any) => ({
      ...prev,
      disciplines: prev.disciplines.includes(value)
        ? prev.disciplines.filter((d: string) => d !== value)
        : [...prev.disciplines, value],
    }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setHasChanges(true);
    setProfileData((prev: any) => ({
      ...prev,
      uploads: { ...prev.uploads, [key]: file },
    }));
  };

  const removeExistingUpload = (key: string) => {
    setHasChanges(true);
    setExistingUploads((prev) => ({ ...prev, [key]: null }));
  };

  // ─── COMPLETION ───
  const getSectionCompletion = (sectionId: string): boolean => {
    switch (sectionId) {
      case "participant":
        return !!(
          profileData.participant.name &&
          profileData.participant.address1 &&
          profileData.participant.pincode
        );
      case "billing":
        return !!(
          profileData.billing.sameAsParticipant ||
          (profileData.billing.companyName && profileData.billing.address1)
        );
      case "shipping":
        return !!(
          profileData.shipping.personName && profileData.shipping.address1
        );
      case "contact":
        return !!(
          profileData.contact.name &&
          profileData.contact.mobile &&
          profileData.contact.email
        );
      case "other":
        return !!profileData.other.designation;
      case "uploads":
        return !!(
          profileData.uploads.gstCertificate ||
          existingUploads.gstCertificate ||
          profileData.uploads.accreditationCertificate ||
          existingUploads.accreditationCertificate
        );
      case "disciplines":
        return profileData.disciplines.length > 0;
      default:
        return false;
    }
  };

  const completedCount = SECTIONS.filter((s) =>
    getSectionCompletion(s.id)
  ).length;
  const completionPercent = Math.round(
    (completedCount / SECTIONS.length) * 100
  );

  // ─── VALIDATION ───
  const validateForm = (): string | null => {
    if (!profileData.participant?.name?.trim())
      return "Participant Lab Name is required";
    if (!profileData.participant?.address1?.trim())
      return "Participant Address is required";
    if (!profileData.participant?.pincode?.trim())
      return "Participant Pincode is required";
    if (!profileData.contact?.name?.trim())
      return "Contact Person Name is required";
    if (!profileData.contact?.mobile?.trim())
      return "Contact Mobile is required";
    if (!profileData.contact?.email?.trim())
      return "Contact Email is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.contact.email))
      return "Please enter a valid email address";

    // Mobile validation
    if (profileData.contact.mobile.length < 10)
      return "Please enter a valid mobile number";

    // Pincode validation
    if (profileData.participant.pincode.length < 5)
      return "Please enter a valid pincode";

    // GSTIN validation (if provided)
    if (
      profileData.participant.gstin &&
      profileData.participant.gstin.length !== 15
    )
      return "GSTIN must be 15 characters";

    // PAN validation (if provided)
    if (profileData.participant.pan && profileData.participant.pan.length !== 10)
      return "PAN must be 10 characters";

    return null;
  };

  // ─── SUBMIT ───
  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error, {
        style: {
          background: "#0f172a",
          color: "#f87171",
          border: "1px solid rgba(248,113,113,0.2)",
        },
        icon: "⚠️",
      });

      // Scroll to first error section
      if (
        error.includes("Participant") ||
        error.includes("GSTIN") ||
        error.includes("PAN") ||
        error.includes("Pincode")
      ) {
        scrollToSection("participant");
      } else if (error.includes("Contact") || error.includes("email") || error.includes("mobile")) {
        scrollToSection("contact");
      }
      return;
    }

    setSaving(true);

    try {
      const { uploads, ...safePayload } = profileData;

      // Include existing uploads info
      safePayload.uploads = {
        gstCertificate: existingUploads.gstCertificate,
        accreditationCertificate: existingUploads.accreditationCertificate,
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safePayload),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      // Upload new files
      if (uploads?.gstCertificate || uploads?.accreditationCertificate) {
        const formData = new FormData();
        if (uploads.gstCertificate instanceof File) {
          formData.append("gstCertificate", uploads.gstCertificate);
        }
        if (uploads.accreditationCertificate instanceof File) {
          formData.append(
            "accreditationCertificate",
            uploads.accreditationCertificate
          );
        }

        const uploadRes = await fetch("/api/profile/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!uploadRes.ok) {
          toast.error("Profile saved but file upload failed", {
            style: {
              background: "#0f172a",
              color: "#fbbf24",
              border: "1px solid rgba(251,191,36,0.2)",
            },
            icon: "⚠️",
          });
        }
      }

      toast.success(
        isNewProfile
          ? "Profile created successfully!"
          : "Profile updated successfully!",
        {
          style: {
            background: "#0f172a",
            color: "#34d399",
            border: "1px solid rgba(52,211,153,0.2)",
          },
          icon: "✅",
        }
      );

      setHasChanges(false);
      router.push("/dashboard");
    } catch (err) {
      toast.error("Failed to update profile. Please try again.", {
        style: {
          background: "#0f172a",
          color: "#f87171",
          border: "1px solid rgba(248,113,113,0.2)",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  // ─── LOADING STATE ───
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#00B4D8] animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00B4D8]/20 border-2 border-[#060d19] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-slate-300">
            Loading your profile...
          </p>
          <p className="text-xs text-slate-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex gap-8">
        {/* ─── LEFT: STICKY NAV ─── */}
        <div className="hidden xl:block w-56 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Progress */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0A3D62] via-[#00B4D8] to-[#90E0EF]" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Progress
                  </p>
                  <span className="text-sm font-bold text-[#00B4D8] tabular-nums">
                    {completionPercent}%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] transition-all duration-700 ease-out relative"
                    style={{ width: `${completionPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  {completedCount} of {SECTIONS.length} sections complete
                </p>
              </div>
            </div>

            {/* Section Nav */}
            <nav className="space-y-1">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                const isComplete = getSectionCompletion(section.id);
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00B4D8]/15 to-[#0A3D62]/10 border border-[#00B4D8]/20" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#00B4D8] shadow-[0_0_12px_rgba(0,180,216,0.5)]" />
                      </>
                    )}

                    <div
                      className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-[#00B4D8]/20 text-[#00B4D8]"
                          : isComplete
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/[0.04] text-slate-500"
                      }`}
                    >
                      {isComplete && !isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <span className="relative">{section.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* View Details Link */}
            <Link
              href="/dashboard/lab-details"
              className="group flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 text-sm font-medium hover:bg-white/[0.05] hover:text-slate-200 transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              View Lab Details
              <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* ─── RIGHT: FORM CONTENT ─── */}
        <div className="flex-1 max-w-4xl space-y-8 pb-28">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-300 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300 font-medium">
              {isNewProfile ? "Create Profile" : "Edit Profile"}
            </span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {isNewProfile ? "Create Profile" : "Update Profile"}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isNewProfile
                    ? "Fill in your lab details to get started"
                    : "Manage participant, billing, shipping and contact details"}
                </p>
              </div>
            </div>

            {/* Unsaved Changes Indicator */}
            {hasChanges && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-amber-400 font-medium">
                  Unsaved changes
                </span>
              </div>
            )}
          </div>

          {/* ─── PARTICIPANT DETAILS ─── */}
          <div ref={sectionRefs.participant}>
            <SectionCard
              icon={Building2}
              title="Participant Details"
              subtitle="Primary laboratory / organization information"
              isComplete={getSectionCompletion("participant")}
            >
              <FormGrid>
                <FormInput
                  icon={Building2}
                  label="Name of Participant Lab"
                  required
                  value={profileData.participant.name}
                  onChange={(e: any) =>
                    handleChange("participant", "name", e.target.value)
                  }
                  placeholder="Enter lab / organization name"
                  colSpan={2}
                />
                <FormInput
                  icon={MapPin}
                  label="Address Line 1"
                  required
                  value={profileData.participant.address1}
                  onChange={(e: any) =>
                    handleChange("participant", "address1", e.target.value)
                  }
                  placeholder="Street address"
                />
                <FormInput
                  icon={MapPin}
                  label="Address Line 2"
                  value={profileData.participant.address2}
                  onChange={(e: any) =>
                    handleChange("participant", "address2", e.target.value)
                  }
                  placeholder="Apt, suite, building (optional)"
                />
                <FormSelect
                  icon={Globe}
                  label="Country"
                  required
                  options={["India"]}
                  value={profileData.participant.country}
                  onChange={(e: any) =>
                    handleChange("participant", "country", e.target.value)
                  }
                />
                <FormSelect
                  icon={MapPin}
                  label="State"
                  required
                  options={INDIAN_STATES}
                  value={profileData.participant.state}
                  onChange={(e: any) =>
                    handleChange("participant", "state", e.target.value)
                  }
                  placeholderOption="Select State"
                />
                <FormInput
                  icon={MapPin}
                  label="City"
                  required
                  value={profileData.participant.city}
                  onChange={(e: any) =>
                    handleChange("participant", "city", e.target.value)
                  }
                  placeholder="Enter city name"
                />
                <FormInput
                  icon={Hash}
                  label="Pincode"
                  required
                  value={profileData.participant.pincode}
                  onChange={(e: any) =>
                    handleChange("participant", "pincode", e.target.value)
                  }
                  placeholder="e.g. 201310"
                  maxLength={6}
                />
                <FormInput
                  icon={FileText}
                  label="GSTIN"
                  value={profileData.participant.gstin}
                  onChange={(e: any) =>
                    handleChange(
                      "participant",
                      "gstin",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  mono
                  maxLength={15}
                  helperText="15-character GST identification number"
                />
                <FormInput
                  icon={FileText}
                  label="TAN No"
                  value={profileData.participant.tan}
                  onChange={(e: any) =>
                    handleChange(
                      "participant",
                      "tan",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. DELA12345A"
                  mono
                  maxLength={10}
                />
                <FormInput
                  icon={FileText}
                  label="PAN No"
                  value={profileData.participant.pan}
                  onChange={(e: any) =>
                    handleChange(
                      "participant",
                      "pan",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. ABCDE1234F"
                  mono
                  maxLength={10}
                  helperText="10-character permanent account number"
                />
              </FormGrid>
            </SectionCard>
          </div>

          {/* ─── BILLING DETAILS ─── */}
          <div ref={sectionRefs.billing}>
            <SectionCard
              icon={CreditCard}
              title="Billing Details"
              subtitle="Invoice and billing address information"
              isComplete={getSectionCompletion("billing")}
            >
              <div className="mb-5">
                <FormCheckbox
                  label="Same as Participant Details"
                  checked={profileData.billing.sameAsParticipant}
                  onChange={(e: any) => {
                    const checked = e.target.checked;
                    setHasChanges(true);
                    setProfileData((prev: any) => ({
                      ...prev,
                      billing: {
                        ...prev.billing,
                        sameAsParticipant: checked,
                        ...(checked
                          ? {
                              companyName: prev.participant.name,
                              address1: prev.participant.address1,
                              address2: prev.participant.address2,
                              country: prev.participant.country,
                              state: prev.participant.state,
                              city: prev.participant.city,
                              pincode: prev.participant.pincode,
                              gstin: prev.participant.gstin,
                              tan: prev.participant.tan,
                              pan: prev.participant.pan,
                            }
                          : {
                              companyName: "",
                              address1: "",
                              address2: "",
                              pincode: "",
                              gstin: "",
                              tan: "",
                              pan: "",
                            }),
                      },
                    }));
                  }}
                />
              </div>

              <div
                className={`transition-all duration-500 ${
                  profileData.billing.sameAsParticipant
                    ? "opacity-40 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <FormGrid>
                  <FormInput
                    icon={Building2}
                    label="Company Name"
                    required={!profileData.billing.sameAsParticipant}
                    value={profileData.billing.companyName}
                    onChange={(e: any) =>
                      handleChange("billing", "companyName", e.target.value)
                    }
                    placeholder="Billing company name"
                    colSpan={2}
                  />
                  <FormInput
                    icon={MapPin}
                    label="Address Line 1"
                    required={!profileData.billing.sameAsParticipant}
                    value={profileData.billing.address1}
                    onChange={(e: any) =>
                      handleChange("billing", "address1", e.target.value)
                    }
                    placeholder="Billing street address"
                  />
                  <FormInput
                    icon={MapPin}
                    label="Address Line 2"
                    value={profileData.billing.address2}
                    onChange={(e: any) =>
                      handleChange("billing", "address2", e.target.value)
                    }
                    placeholder="Apt, suite (optional)"
                  />
                  <FormSelect
                    icon={Globe}
                    label="Country"
                    required
                    options={["India"]}
                    value={profileData.billing.country}
                    onChange={(e: any) =>
                      handleChange("billing", "country", e.target.value)
                    }
                  />
                  <FormSelect
                    icon={MapPin}
                    label="State"
                    required
                    options={INDIAN_STATES}
                    value={profileData.billing.state}
                    onChange={(e: any) =>
                      handleChange("billing", "state", e.target.value)
                    }
                    placeholderOption="Select State"
                  />
                  <FormInput
                    icon={MapPin}
                    label="City"
                    required
                    value={profileData.billing.city}
                    onChange={(e: any) =>
                      handleChange("billing", "city", e.target.value)
                    }
                    placeholder="Enter city"
                  />
                  <FormInput
                    icon={Hash}
                    label="Pincode"
                    required
                    value={profileData.billing.pincode}
                    onChange={(e: any) =>
                      handleChange("billing", "pincode", e.target.value)
                    }
                    placeholder="e.g. 201310"
                    maxLength={6}
                  />
                  <FormInput
                    icon={FileText}
                    label="GSTIN"
                    value={profileData.billing.gstin}
                    onChange={(e: any) =>
                      handleChange("billing", "gstin", e.target.value.toUpperCase())
                    }
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    mono
                    maxLength={15}
                  />
                  <FormInput
                    icon={FileText}
                    label="TAN No"
                    value={profileData.billing.tan}
                    onChange={(e: any) =>
                      handleChange("billing", "tan", e.target.value.toUpperCase())
                    }
                    placeholder="e.g. DELA12345A"
                    mono
                    maxLength={10}
                  />
                  <FormInput
                    icon={FileText}
                    label="PAN No"
                    value={profileData.billing.pan}
                    onChange={(e: any) =>
                      handleChange("billing", "pan", e.target.value.toUpperCase())
                    }
                    placeholder="e.g. ABCDE1234F"
                    mono
                    maxLength={10}
                  />
                </FormGrid>
              </div>
            </SectionCard>
          </div>

          {/* ─── SHIPPING DETAILS ─── */}
          <div ref={sectionRefs.shipping}>
            <SectionCard
              icon={Truck}
              title="Shipping Details"
              subtitle="Where PT items should be delivered"
              isComplete={getSectionCompletion("shipping")}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { value: "participant", label: "Same as Participant" },
                  { value: "billing", label: "Same as Billing" },
                  { value: "others", label: "Other Address" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setHasChanges(true);
                      if (opt.value === "participant") {
                        setProfileData((prev: any) => ({
                          ...prev,
                          shipping: {
                            sameAs: "participant",
                            personName: prev.contact.name,
                            address1: prev.participant.address1,
                            address2: prev.participant.address2,
                            country: prev.participant.country,
                            state: prev.participant.state,
                            city: prev.participant.city,
                            pincode: prev.participant.pincode,
                          },
                        }));
                      } else if (opt.value === "billing") {
                        setProfileData((prev: any) => ({
                          ...prev,
                          shipping: {
                            sameAs: "billing",
                            personName: prev.contact.name,
                            address1: prev.billing.address1,
                            address2: prev.billing.address2,
                            country: prev.billing.country,
                            state: prev.billing.state,
                            city: prev.billing.city,
                            pincode: prev.billing.pincode,
                          },
                        }));
                      } else {
                        setProfileData((prev: any) => ({
                          ...prev,
                          shipping: { ...prev.shipping, sameAs: "others" },
                        }));
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      profileData.shipping.sameAs === opt.value
                        ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20 shadow-sm shadow-[#00B4D8]/10"
                        : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.05] hover:text-slate-300"
                    }`}
                  >
                    <CircleDot
                      className={`w-4 h-4 ${
                        profileData.shipping.sameAs === opt.value
                          ? "text-[#00B4D8]"
                          : "text-slate-600"
                      }`}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>

              <FormGrid>
                <FormInput
                  icon={UserCog}
                  label="Shipping Person Name"
                  required
                  value={profileData.shipping.personName}
                  onChange={(e: any) =>
                    handleChange("shipping", "personName", e.target.value)
                  }
                  placeholder="Contact person for delivery"
                  colSpan={2}
                />
                <FormInput
                  icon={MapPin}
                  label="Address Line 1"
                  required
                  value={profileData.shipping.address1}
                  onChange={(e: any) =>
                    handleChange("shipping", "address1", e.target.value)
                  }
                  placeholder="Delivery street address"
                />
                <FormInput
                  icon={MapPin}
                  label="Address Line 2"
                  value={profileData.shipping.address2}
                  onChange={(e: any) =>
                    handleChange("shipping", "address2", e.target.value)
                  }
                  placeholder="Apt, suite (optional)"
                />
                <FormSelect
                  icon={Globe}
                  label="Country"
                  required
                  options={["India"]}
                  value={profileData.shipping.country}
                  onChange={(e: any) =>
                    handleChange("shipping", "country", e.target.value)
                  }
                />
                <FormSelect
                  icon={MapPin}
                  label="State"
                  required
                  options={INDIAN_STATES}
                  value={profileData.shipping.state}
                  onChange={(e: any) =>
                    handleChange("shipping", "state", e.target.value)
                  }
                  placeholderOption="Select State"
                />
                <FormInput
                  icon={MapPin}
                  label="City"
                  required
                  value={profileData.shipping.city}
                  onChange={(e: any) =>
                    handleChange("shipping", "city", e.target.value)
                  }
                  placeholder="Enter city"
                />
                <FormInput
                  icon={Hash}
                  label="Pincode"
                  required
                  value={profileData.shipping.pincode}
                  onChange={(e: any) =>
                    handleChange("shipping", "pincode", e.target.value)
                  }
                  placeholder="e.g. 201310"
                  maxLength={6}
                />
              </FormGrid>
            </SectionCard>
          </div>

          {/* ─── CONTACT PERSON ─── */}
          <div ref={sectionRefs.contact}>
            <SectionCard
              icon={Phone}
              title="Contact Person Details"
              subtitle="Primary administrator contact information"
              isComplete={getSectionCompletion("contact")}
            >
              <FormGrid>
                <FormInput
                  icon={UserCog}
                  label="Contact Person Name"
                  required
                  value={profileData.contact.name}
                  onChange={(e: any) =>
                    handleChange("contact", "name", e.target.value)
                  }
                  placeholder="Full name"
                  colSpan={2}
                />
                <FormInput
                  icon={Smartphone}
                  label="Mobile Number"
                  required
                  value={profileData.contact.mobile}
                  onChange={(e: any) =>
                    handleChange("contact", "mobile", e.target.value)
                  }
                  placeholder="+91 XXXXX XXXXX"
                  maxLength={13}
                  helperText="Include country code"
                />
                <FormInput
                  icon={Mail}
                  label="Email Address"
                  required
                  value={profileData.contact.email}
                  onChange={(e: any) =>
                    handleChange("contact", "email", e.target.value)
                  }
                  placeholder="primary@example.com"
                  inputType="email"
                />
                <FormInput
                  icon={Mail}
                  label="Alternate Email"
                  value={profileData.contact.alternateEmail}
                  onChange={(e: any) =>
                    handleChange("contact", "alternateEmail", e.target.value)
                  }
                  placeholder="backup@example.com (optional)"
                  inputType="email"
                  colSpan={2}
                />
              </FormGrid>
            </SectionCard>
          </div>

          {/* ─── OTHER DETAILS ─── */}
          <div ref={sectionRefs.other}>
            <SectionCard
              icon={Settings2}
              title="Other Details"
              subtitle="Additional information about your organization"
              isComplete={getSectionCompletion("other")}
            >
              <FormGrid>
                <FormInput
                  icon={Briefcase}
                  label="Designation"
                  required
                  value={profileData.other.designation}
                  onChange={(e: any) =>
                    handleChange("other", "designation", e.target.value)
                  }
                  placeholder="e.g. Lab Manager"
                />
                <FormSelect
                  icon={Award}
                  label="Accreditation By"
                  options={["NABL", "ISO"]}
                  value={profileData.other.accreditationBy}
                  onChange={(e: any) =>
                    handleChange("other", "accreditationBy", e.target.value)
                  }
                  placeholderOption="Select accreditation body"
                />
                <FormInput
                  icon={Link2}
                  label="Website"
                  value={profileData.other.website}
                  onChange={(e: any) =>
                    handleChange("other", "website", e.target.value)
                  }
                  placeholder="https://example.com (optional)"
                  inputType="url"
                />
                <FormInput
                  icon={Hash}
                  label="Certificate No"
                  value={profileData.other.certificateNo}
                  onChange={(e: any) =>
                    handleChange("other", "certificateNo", e.target.value)
                  }
                  placeholder="e.g. TC-1234"
                  mono
                />
              </FormGrid>
            </SectionCard>
          </div>

          {/* ─── UPLOADS ─── */}
          <div ref={sectionRefs.uploads}>
            <SectionCard
              icon={Upload}
              title="Document Uploads"
              subtitle="Upload required certificates and documents"
              isComplete={getSectionCompletion("uploads")}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FileUploadCard
                  label="GST Certificate (Billing)"
                  description="Upload your GST registration certificate"
                  newFile={profileData.uploads.gstCertificate}
                  existingUrl={existingUploads.gstCertificate}
                  onNewFile={(file) => handleFileChange("gstCertificate", file)}
                  onRemoveExisting={() =>
                    removeExistingUpload("gstCertificate")
                  }
                />
                <FileUploadCard
                  label="Accreditation Certificate"
                  description="Upload your accreditation certificate"
                  newFile={profileData.uploads.accreditationCertificate}
                  existingUrl={existingUploads.accreditationCertificate}
                  onNewFile={(file) =>
                    handleFileChange("accreditationCertificate", file)
                  }
                  onRemoveExisting={() =>
                    removeExistingUpload("accreditationCertificate")
                  }
                />
              </div>
            </SectionCard>
          </div>

          {/* ─── DISCIPLINES ─── */}
          <div ref={sectionRefs.disciplines}>
            <SectionCard
              icon={GraduationCap}
              title="Disciplines"
              subtitle="Select applicable testing disciplines"
              isComplete={getSectionCompletion("disciplines")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DISCIPLINES.map((d) => {
                  const isChecked = profileData.disciplines.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDiscipline(d)}
                      className={`group flex items-center gap-3 p-4 rounded-xl text-sm font-medium text-left transition-all duration-300 ${
                        isChecked
                          ? "bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#90E0EF]"
                          : "bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:bg-white/[0.04] hover:border-white/[0.1] hover:text-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
                          isChecked
                            ? "bg-[#00B4D8] text-white"
                            : "bg-white/[0.06] border border-white/[0.1]"
                        }`}
                      >
                        {isChecked && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="flex-1">{d}</span>
                    </button>
                  );
                })}
              </div>

              {profileData.disciplines.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-[#00B4D8]" />
                  <p className="text-xs text-slate-500">
                    <span className="text-slate-300 font-medium">
                      {profileData.disciplines.length}
                    </span>{" "}
                    discipline
                    {profileData.disciplines.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>

      {/* ─── STICKY BOTTOM SAVE BAR ─── */}
      <div className="fixed bottom-0 left-[280px] right-0 z-40">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />
        <div className="bg-[#0a1628]/90 backdrop-blur-xl border-t border-white/[0.06] px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-32 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] transition-all duration-700"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                  {completionPercent}% complete
                </span>
              </div>

              {hasChanges && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Unsaved changes</span>
                </div>
              )}

              {completionPercent < 100 && !hasChanges && (
                <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Fill required fields to complete profile</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="group flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving
                  ? "Saving..."
                  : isNewProfile
                  ? "Create Profile"
                  : "Save Changes"}
                {!saving && (
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  isComplete,
  children,
}: {
  icon: any;
  title: string;
  subtitle: string;
  isComplete: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] hover:border-white/[0.08] transition-all duration-500">
      <div
        className={`h-[2px] bg-gradient-to-r transition-all duration-700 ${
          isComplete
            ? "from-emerald-500/30 via-emerald-400/60 to-emerald-500/30"
            : "from-transparent via-white/[0.06] to-transparent"
        }`}
      />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#00B4D8]/[0.02] blur-3xl" />
      <div className="relative p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isComplete
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-[#00B4D8]/10 border border-[#00B4D8]/15"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Icon className="w-5 h-5 text-[#00B4D8]" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          {isComplete && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  );
}

function FormInput({
  icon: Icon,
  label,
  required,
  value,
  onChange,
  placeholder,
  mono,
  colSpan,
  maxLength,
  helperText,
  inputType = "text",
}: {
  icon: any;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  mono?: boolean;
  colSpan?: number;
  maxLength?: number;
  helperText?: string;
  inputType?: string;
}) {
  const isFilled = value?.trim()?.length > 0;

  return (
    <div className={colSpan === 2 ? "md:col-span-2" : ""}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        <Icon className="w-3 h-3 text-slate-500" />
        {label}
        {required && <span className="text-red-400 text-[10px]">*</span>}
        {isFilled && (
          <CheckCircle2 className="w-3 h-3 text-emerald-500/50 ml-auto" />
        )}
      </label>
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-[#060d19]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all duration-200 ${
          mono ? "font-mono" : ""
        } ${
          isFilled
            ? "border-white/[0.08]"
            : required
            ? "border-white/[0.06]"
            : "border-white/[0.06]"
        }`}
      />
      {helperText && (
        <p className="mt-1.5 text-[10px] text-slate-600 flex items-center gap-1">
          <Info className="w-3 h-3" />
          {helperText}
        </p>
      )}
      {maxLength && value?.length > 0 && (
        <p className="mt-1 text-[10px] text-slate-600 text-right tabular-nums">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

function FormSelect({
  icon: Icon,
  label,
  required,
  options,
  value,
  onChange,
  placeholderOption,
}: {
  icon: any;
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (e: any) => void;
  placeholderOption?: string;
}) {
  const isFilled = value?.trim()?.length > 0;

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        <Icon className="w-3 h-3 text-slate-500" />
        {label}
        {required && <span className="text-red-400 text-[10px]">*</span>}
        {isFilled && (
          <CheckCircle2 className="w-3 h-3 text-emerald-500/50 ml-auto" />
        )}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all duration-200 cursor-pointer"
        >
          {placeholderOption && (
            <option value="" className="bg-[#0d1a2d] text-slate-400">
              {placeholderOption}
            </option>
          )}
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#0d1a2d] text-white">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

function FormCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (e: any) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange({ target: { checked: !checked } })}
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        checked
          ? "bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#90E0EF]"
          : "bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-[#00B4D8] text-white"
            : "bg-white/[0.06] border border-white/[0.1]"
        }`}
      >
        {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
      {label}
    </button>
  );
}

function FileUploadCard({
  label,
  description,
  newFile,
  existingUrl,
  onNewFile,
  onRemoveExisting,
}: {
  label: string;
  description: string;
  newFile: File | null;
  existingUrl: string | null;
  onNewFile: (file: File | null) => void;
  onRemoveExisting: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // New file selected (takes priority)
  if (newFile) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/[0.03] p-5">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onNewFile(e.target.files?.[0] ?? null)}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-emerald-400 truncate max-w-[180px]">
                {newFile.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {(newFile.size / 1024).toFixed(1)} KB • New upload
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">{label}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => inputRef.current?.click()}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-slate-400 transition-all"
              title="Replace file"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNewFile(null)}
              className="p-1.5 rounded-lg bg-red-500/[0.06] border border-red-500/10 hover:bg-red-500/10 text-red-400 transition-all"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Existing file from server
  if (existingUrl) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-[#00B4D8]/20 bg-[#00B4D8]/[0.03] p-5">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onNewFile(e.target.files?.[0] ?? null)}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5 text-[#00B4D8]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#90E0EF]">{label}</p>
              <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                Previously uploaded
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {existingUrl.startsWith("http") && (
              <a
                href={existingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/15 hover:bg-[#00B4D8]/15 text-[#00B4D8] transition-all"
                title="View file"
              >
                <Eye className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => inputRef.current?.click()}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-slate-400 transition-all"
              title="Replace file"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRemoveExisting}
              className="p-1.5 rounded-lg bg-red-500/[0.06] border border-red-500/10 hover:bg-red-500/10 text-red-400 transition-all"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state — no file
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] hover:border-[#00B4D8]/20 hover:bg-[#00B4D8]/[0.02] transition-all duration-300">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onNewFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full p-6 flex flex-col items-center gap-3 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
          <FileUp className="w-5 h-5 text-slate-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
        </div>
        <p className="text-[10px] text-slate-600">PDF, JPG, PNG • Max 5MB</p>
      </button>
    </div>
  );
}