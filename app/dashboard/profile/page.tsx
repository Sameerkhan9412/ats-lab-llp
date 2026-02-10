"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState<any>({
    participant: {
      name: "",
      address1: "",
      address2: "",
      country: "India",
      state: "Uttar Pradesh",
      city: "Greater Noida",
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
      state: "Uttar Pradesh",
      city: "Greater Noida",
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
      state: "Uttar Pradesh",
      city: "Greater Noida",
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
    disciplines: [],
    uploads: {
      gstCertificate: null,
      accreditationCertificate: null,
    },
  });

  const handleChange = (section: string, field: string, value: any) => {
    setProfileData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const toggleDiscipline = (value: string) => {
    setProfileData((prev: any) => ({
      ...prev,
      disciplines: prev.disciplines.includes(value)
        ? prev.disciplines.filter((d: string) => d !== value)
        : [...prev.disciplines, value],
    }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setProfileData((prev: any) => ({
      ...prev,
      uploads: {
        ...prev.uploads,
        [key]: file,
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      !profileData.participant?.name ||
      !profileData.participant?.address1 ||
      !profileData.contact?.email
    ) {
      alert("Please fill all required fields");
      return;
    }

    // 1️⃣ Remove uploads from JSON payload
    const { uploads, ...safePayload } = profileData;

    // 2️⃣ Save profile data (JSON)
    const res = await fetch("/api/profile", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safePayload),
    });

    if (!res.ok) {
      alert("Failed to update profile");
      return;
    }

    // 3️⃣ Upload files AFTER profile is saved
    if (uploads?.gstCertificate || uploads?.accreditationCertificate) {
      const formData = new FormData();

      if (uploads.gstCertificate) {
        formData.append("gstCertificate", uploads.gstCertificate);
      }

      if (uploads.accreditationCertificate) {
        formData.append(
          "accreditationCertificate",
          uploads.accreditationCertificate,
        );
      }

      await fetch("/api/profile/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
    }

    // 4️⃣ Redirect only after everything is done
    toast.success("profile updated")
    router.push("/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-slate-200">Update Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage participant, billing, shipping and contact details
        </p>
      </div>

      {/* PARTICIPANT DETAILS */}
      <Section title="Participant Details">
        <Grid>
          <Input
            label="Name of Participant Lab"
            required
            value={profileData.participant.name}
            onChange={(e: any) =>
              handleChange("participant", "name", e.target.value)
            }
          />

          <Input
            label="Address Line 1"
            required
            value={profileData.participant.address1}
            onChange={(e: any) =>
              handleChange("participant", "address1", e.target.value)
            }
          />
          <Input
            label="Address Line 2"
            value={profileData.participant.address2}
            onChange={(e: any) =>
              handleChange("participant", "address2", e.target.value)
            }
          />
          <Select
            label="Country"
            required
            options={["India"]}
            value={profileData.participant.country}
            onChange={(e: any) =>
              handleChange("participant", "country", e.target.value)
            }
          />
          <Select
            label="State"
            required
            options={["Uttar Pradesh"]}
            value={profileData.participant.state}
            onChange={(e: any) =>
              handleChange("participant", "state", e.target.value)
            }
          />
          <Select
            label="City"
            required
            options={["Greater Noida"]}
            value={profileData.participant.city}
            onChange={(e: any) =>
              handleChange("participant", "city", e.target.value)
            }
          />
          <Input
            label="Pincode"
            required
            value={profileData.participant.pincode}
            onChange={(e: any) =>
              handleChange("participant", "pincode", e.target.value)
            }
          />
          <Input
            label="GSTIN"
            value={profileData.participant.gstin}
            onChange={(e: any) =>
              handleChange("participant", "gstin", e.target.value)
            }
          />
          <Input
            label="TAN No"
            value={profileData.participant.tan}
            onChange={(e: any) =>
              handleChange("participant", "tan", e.target.value)
            }
          />
          <Input
            label="PAN No"
            value={profileData.participant.pan}
            onChange={(e: any) =>
              handleChange("participant", "pan", e.target.value)
            }
          />
        </Grid>
      </Section>

      {/* BILLING DETAILS */}
      <Section title="Billing Details">
        <Checkbox
          label="Same as Participant Details"
          checked={profileData.billing.sameAsParticipant}
          onChange={(e: any) => {
            const checked = e.target.checked;
            setProfileData((prev: any) => ({
              ...prev,
              billing: {
                ...prev.billing,
                sameAsParticipant: checked,
                ...(checked
                  ? { ...prev.participant }
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
        <Grid>
          <Input
            label="Company Name"
            required
            value={profileData.billing.companyName}
            onChange={(e: any) =>
              handleChange("billing", "companyName", e.target.value)
            }
          />
          <Input
            label="Billing Address Line 1"
            required
            value={profileData.billing.address1}
            onChange={(e: any) =>
              handleChange("billing", "address1", e.target.value)
            }
          />
          <Input
            label="Billing Address Line 2"
            value={profileData.billing.address2}
            onChange={(e: any) =>
              handleChange("billing", "address2", e.target.value)
            }
          />
          <Select
            label="Billing Country"
            required
            options={["India"]}
            value={profileData.billing.country}
            onChange={(e: any) =>
              handleChange("billing", "country", e.target.value)
            }
          />
          <Select
            label="Billing State"
            required
            options={["Uttar Pradesh"]}
            value={profileData.billing.state}
            onChange={(e: any) =>
              handleChange("billing", "state", e.target.value)
            }
          />
          <Select
            label="Billing City"
            required
            options={["Greater Noida"]}
            value={profileData.billing.city}
            onChange={(e: any) =>
              handleChange("billing", "city", e.target.value)
            }
          />
          <Input
            label="Billing Pincode"
            required
            value={profileData.billing.pincode}
            onChange={(e: any) =>
              handleChange("billing", "pincode", e.target.value)
            }
          />
          <Input
            label="Billing GSTIN"
            value={profileData.billing.gstin}
            onChange={(e: any) =>
              handleChange("billing", "gstin", e.target.value)
            }
          />
          <Input
            label="Billing TAN No"
            value={profileData.billing.tan}
            onChange={(e: any) =>
              handleChange("billing", "tan", e.target.value)
            }
          />
          <Input
            label="Billing PAN No"
            value={profileData.billing.pan}
            onChange={(e: any) =>
              handleChange("billing", "pan", e.target.value)
            }
          />
        </Grid>
      </Section>

      {/* SHIPPING DETAILS */}
      <Section title="Shipping Details">
        <div className="flex flex-wrap gap-6 text-sm text-slate-300">
          <Radio
            label="Same as Participant"
            name="shipping"
            value="participant"
            checked={profileData.shipping.sameAs === "participant"}
            onChange={() => {
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
}}

          />
          <Radio
            label="Same as Billing"
            name="shipping"
            value="billing"
            checked={profileData.shipping.sameAs === "billing"}
            onChange={() => {
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
}}

          />
          <Radio
            label="Others"
            name="shipping"
            value="others"
            checked={profileData.shipping.sameAs === "others"}
            onChange={() => {
  setProfileData((prev: any) => ({
    ...prev,
    shipping: {
      ...prev.shipping,
      sameAs: "others",
    },
  }));
}}

          />
        </div>

        <Grid>
          <Input
            label="Shipping Person Name"
            required
            value={profileData.shipping.personName}
            onChange={(e: any) =>
              handleChange("shipping", "personName", e.target.value)
            }
          />
          <Input
            label="Shipping Address Line 1"
            required
            value={profileData.shipping.address1}
            onChange={(e: any) =>
              handleChange("shipping", "address1", e.target.value)
            }
          />
          <Input
            label="Shipping Address Line 2"
            value={profileData.shipping.address2}
            onChange={(e: any) =>
              handleChange("shipping", "address2", e.target.value)
            }
          />
          <Select
            label="Shipping Country"
            required
            options={["India"]}
            value={profileData.shipping.country}
            onChange={(e: any) =>
              handleChange("shipping", "country", e.target.value)
            }
          />
          <Select
            label="Shipping State"
            required
            options={["Uttar Pradesh"]}
            value={profileData.shipping.state}
            onChange={(e: any) =>
              handleChange("shipping", "state", e.target.value)
            }
          />
          <Select
            label="Shipping City"
            required
            options={["Greater Noida"]}
            value={profileData.shipping.city}
            onChange={(e: any) =>
              handleChange("shipping", "city", e.target.value)
            }
          />
          <Input
            label="Shipping Pincode"
            required
            value={profileData.shipping.pincode}
            onChange={(e: any) =>
              handleChange("shipping", "pincode", e.target.value)
            }
          />
        </Grid>
      </Section>

      {/* CONTACT PERSON */}
      <Section title="Contact Person Details (Administrator)">
        <Grid>
          <Input
            label="Contact Person Name"
            required
            value={profileData.contact.name}
            onChange={(e: any) =>
              handleChange("contact", "name", e.target.value)
            }
          />
          <Input
            label="Contact Mobile"
            required
            value={profileData.contact.mobile}
            onChange={(e: any) =>
              handleChange("contact", "mobile", e.target.value)
            }
          />
          <Input
            label="Contact Email"
            required
            value={profileData.contact.email}
            onChange={(e: any) =>
              handleChange("contact", "email", e.target.value)
            }
          />
          <Input
            label="Alternate Email"
            value={profileData.contact.alternateEmail}
            onChange={(e: any) =>
              handleChange("contact", "alternateEmail", e.target.value)
            }
          />
        </Grid>
      </Section>

      {/* OTHER DETAILS */}
      <Section title="Other Details">
        <Grid>
          <Input
            label="Designation"
            required
            value={profileData.other.designation}
            onChange={(e: any) =>
              handleChange("other", "designation", e.target.value)
            }
          />
          <Select
            label="Accreditation By"
            options={["NABL", "ISO"]}
            value={profileData.other.accreditationBy}
            onChange={(e: any) =>
              handleChange("other", "accreditationBy", e.target.value)
            }
          />
          <Input
            label="Website (Optional)"
            value={profileData.other.website}
            onChange={(e: any) =>
              handleChange("other", "website", e.target.value)
            }
          />
          <Input
            label="Certificate No"
            value={profileData.other.certificateNo}
            onChange={(e: any) =>
              handleChange("other", "certificateNo", e.target.value)
            }
          />
        </Grid>
      </Section>

      {/* UPLOADS */}
      <Section title="Uploads">
        <Grid>
          <File
            label="GST Certificate (Billing)"
            onChange={(file: File | null) =>
              handleFileChange("gstCertificate", file)
            }
          />
          <File
            label="Accreditation Certificate"
            onChange={(file: File | null) =>
              handleFileChange("accreditationCertificate", file)
            }
          />
        </Grid>
      </Section>

      {/* DISCIPLINE */}
      <Section title="Discipline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            "Chemical (Testing)",
            "Mechanical (Testing)",
            "Non Destructive Testing",
            "Biological (Testing)",
            "Electrical (Testing)",
            "Mechanical (Calibration)",
          ].map((d) => (
            <Checkbox
              key={d}
              label={d}
              checked={profileData.disciplines.includes(d)}
              onChange={() => toggleDiscipline(d)}
            />
          ))}
        </div>
      </Section>

      {/* SUBMIT */}
      <div className="flex justify-end">
        <button
          className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-600 transition"
          onClick={handleSubmit}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }: any) {
  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-cyan-400">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  );
}

function Input({ label, required, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0b1220]
        border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
      />
    </div>
  );
}

function Select({ label, options = [], required, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0b1220]
        border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
      >
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        className="accent-cyan-500"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-slate-300">{label}</span>
    </label>
  );
}

function Radio({ label, name, value, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-cyan-500"
      />
      <span>{label}</span>
    </label>
  );
}

function File({ label, onChange }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400">{label}</label>
      <input
        type="file"
        className="mt-1 block w-full text-sm text-slate-300"
        onChange={(e: any) =>
          onChange ? onChange(e.target.files?.[0] ?? null) : undefined
        }
      />
    </div>
  );
}
