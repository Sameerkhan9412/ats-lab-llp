"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  IndianRupee,
  Receipt,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  PackageOpen,
  Beaker,
  Lock,
  Wallet,
  ArrowRight,
  Info,
  Building2,
  MapPin,
  Globe,
  Hash,
  FileText,
  Phone,
  Mail,
  Smartphone,
  Truck,
  UserCog,
  Briefcase,
  ChevronDown,
  CircleDot,
  Eye,
  EyeOff,
  Package,
  Train,
  Car,
  Plane,
  Ship,
  BadgeCheck,
  Clock,
  Edit3,
  Save,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface CartItem {
  _id: string;
  programId: string;
  programName: string;
  fees: number;
}

interface CheckoutDetails {
  participant: {
    name: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    gstin: string;
    pan: string;
  };
  billing: {
    sameAsParticipant: boolean;
    companyName: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    gstin: string;
    pan: string;
  };
  shipping: {
    sameAs: string;
    personName: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
  };
  contact: {
    name: string;
    designation: string;
    mobile: string;
    email: string;
    alternateEmail: string;
  };
  transport: {
    preferredMode: string;
    specialInstructions: string;
  };
}

const TRANSPORT_MODES = [
  {
    value: "courier",
    label: "Courier Service",
    icon: Package,
    description: "Standard delivery via courier (3-7 days)",
  },
  {
    value: "transport",
    label: "Road Transport",
    icon: Car,
    description: "Via road transport service",
  },
  {
    value: "rail",
    label: "Rail Cargo",
    icon: Train,
    description: "Via Indian Railways parcel service",
  },
  {
    value: "air",
    label: "Air Cargo",
    icon: Plane,
    description: "Express air freight (1-2 days)",
  },
  {
    value: "hand",
    label: "Hand Delivery",
    icon: Truck,
    description: "Collect from our facility",
  },
];

const CHECKOUT_STEPS = [
  { id: "cart", label: "Cart Review", icon: ShoppingCart },
  { id: "participant", label: "Participant", icon: Building2 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "contact", label: "Contact Person", icon: Phone },
  { id: "transport", label: "Transport", icon: Package },
  { id: "review", label: "Review & Pay", icon: BadgeCheck },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh",
  "Puducherry",
];

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<CartItem | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [details, setDetails] = useState<CheckoutDetails>({
    participant: {
      name: "", address1: "", address2: "", country: "India",
      state: "", city: "", pincode: "", gstin: "", pan: "",
    },
    billing: {
      sameAsParticipant: false, companyName: "", address1: "", address2: "",
      country: "India", state: "", city: "", pincode: "", gstin: "", pan: "",
    },
    shipping: {
      sameAs: "participant", personName: "", address1: "", address2: "",
      country: "India", state: "", city: "", pincode: "",
    },
    contact: {
      name: "", designation: "", mobile: "", email: "", alternateEmail: "",
    },
    transport: {
      preferredMode: "courier", specialInstructions: "",
    },
  });

  // Toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  const showToast = (text: string, type: "success" | "error") => {
    setNotificationMessage(text);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  // ─── FETCH CART ───
  useEffect(() => {
    fetchCart();
    fetchProfile();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const fetchCart = async () => {
    try {
      setFetchingCart(true);
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data || []);
    } catch {
      showToast("Failed to load cart", "error");
    } finally {
      setFetchingCart(false);
    }
  };

  // ─── FETCH PROFILE & PREFILL ───
  const fetchProfile = async () => {
    try {
      setFetchingProfile(true);
      const res = await fetch("/api/profile", { credentials: "include" });
      const data = await res.json();

      if (data?.profile) {
        const p = data.profile;
        setDetails({
          participant: {
            name: p.participant?.name || "",
            address1: p.participant?.address1 || "",
            address2: p.participant?.address2 || "",
            country: p.participant?.country || "India",
            state: p.participant?.state || "",
            city: p.participant?.city || "",
            pincode: p.participant?.pincode || "",
            gstin: p.participant?.gstin || "",
            pan: p.participant?.pan || "",
          },
          billing: {
            sameAsParticipant: p.billing?.sameAsParticipant || false,
            companyName: p.billing?.companyName || p.participant?.name || "",
            address1: p.billing?.address1 || p.participant?.address1 || "",
            address2: p.billing?.address2 || p.participant?.address2 || "",
            country: p.billing?.country || p.participant?.country || "India",
            state: p.billing?.state || p.participant?.state || "",
            city: p.billing?.city || p.participant?.city || "",
            pincode: p.billing?.pincode || p.participant?.pincode || "",
            gstin: p.billing?.gstin || p.participant?.gstin || "",
            pan: p.billing?.pan || p.participant?.pan || "",
          },
          shipping: {
            sameAs: p.shipping?.sameAs || "participant",
            personName: p.shipping?.personName || p.contact?.name || "",
            address1: p.shipping?.address1 || p.participant?.address1 || "",
            address2: p.shipping?.address2 || p.participant?.address2 || "",
            country: p.shipping?.country || p.participant?.country || "India",
            state: p.shipping?.state || p.participant?.state || "",
            city: p.shipping?.city || p.participant?.city || "",
            pincode: p.shipping?.pincode || p.participant?.pincode || "",
          },
          contact: {
            name: p.contact?.name || "",
            designation: p.other?.designation || "",
            mobile: p.contact?.mobile || "",
            email: p.contact?.email || "",
            alternateEmail: p.contact?.alternateEmail || "",
          },
          transport: {
            preferredMode: "courier",
            specialInstructions: "",
          },
        });
        setProfileLoaded(true);
      }
    } catch {
      console.error("Failed to fetch profile");
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleChange = (section: keyof CheckoutDetails, field: string, value: any) => {
    setDetails((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // ─── CALCULATIONS ───
  const subtotal = items.reduce((acc, item) => acc + item.fees, 0);
  const GST_RATE = 0.18;
  const gstAmount = subtotal * GST_RATE;
  const total = subtotal + gstAmount;

  // ─── STEP VALIDATION ───
  const validateStep = (step: number): string | null => {
    switch (step) {
      case 0: // Cart
        if (items.length === 0) return "Cart is empty";
        return null;
      case 1: // Participant
        if (!details.participant.name.trim()) return "Participant Lab Name is required";
        if (!details.participant.address1.trim()) return "Participant Address is required";
        if (!details.participant.pincode.trim()) return "Participant Pincode is required";
        return null;
      case 2: // Billing
        if (!details.billing.sameAsParticipant) {
          if (!details.billing.companyName.trim()) return "Billing Company Name is required";
          if (!details.billing.address1.trim()) return "Billing Address is required";
          if (!details.billing.pincode.trim()) return "Billing Pincode is required";
        }
        return null;
      case 3: // Shipping
        if (!details.shipping.personName.trim()) return "Shipping Person Name is required";
        if (!details.shipping.address1.trim()) return "Shipping Address is required";
        if (!details.shipping.pincode.trim()) return "Shipping Pincode is required";
        return null;
      case 4: // Contact
        if (!details.contact.name.trim()) return "Contact Person Name is required";
        if (!details.contact.mobile.trim()) return "Contact Mobile is required";
        if (!details.contact.email.trim()) return "Contact Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(details.contact.email)) return "Please enter a valid email";
        return null;
      case 5: // Transport
        if (!details.transport.preferredMode) return "Please select a transport mode";
        return null;
      default:
        return null;
    }
  };

  const isStepComplete = (step: number): boolean => validateStep(step) === null;

  const goNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      showToast(error, "error");
      return;
    }
    if (currentStep < CHECKOUT_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ─── RAZORPAY ───
  const loadScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) { resolve(true); return; }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    // Validate all steps
    for (let i = 0; i < CHECKOUT_STEPS.length - 1; i++) {
      const error = validateStep(i);
      if (error) {
        showToast(error, "error");
        setCurrentStep(i);
        return;
      }
    }

    if (items.length === 0) return;
    setLoading(true);

    const scriptLoaded = await loadScript();
    if (!scriptLoaded) {
      showToast("Payment gateway failed to load.", "error");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "PT Program Purchase",
        description: "PT Program Payment",
        prefill: {
          name: details.contact.name,
          email: details.contact.email,
          contact: details.contact.mobile,
        },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                items,
                subtotal,
                gstAmount,
                totalAmount: total,
                checkoutDetails: details,
              },
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            await fetch("/api/cart/clear", { method: "DELETE" });
            window.location.href = "/dashboard/order-success";
          } else {
            showToast("Payment verification failed", "error");
          }
        },
        theme: { color: "#00B4D8" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      showToast("Failed to initiate payment", "error");
    }
    setLoading(false);
  };

  const removeItem = async (item: CartItem) => {
    setRemovingId(item._id);
    try {
      await fetch(`/api/cart/${item._id}`, { method: "DELETE" });
      showToast(`"${item.programName}" removed`, "success");
      fetchCart();
    } catch {
      showToast("Failed to remove item", "error");
    }
    setRemovingId(null);
    setRemoveConfirm(null);
  };

  // ─── BILLING SAME-AS HANDLER ───
  const handleBillingSameAs = (checked: boolean) => {
    setDetails((prev) => ({
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
              pan: prev.participant.pan,
            }
          : {}),
      },
    }));
  };

  // ─── SHIPPING SAME-AS HANDLER ───
  const handleShippingSameAs = (source: string) => {
    const src = source === "billing" ? details.billing : details.participant;
    setDetails((prev) => ({
      ...prev,
      shipping: {
        sameAs: source,
        personName: prev.contact.name || prev.shipping.personName,
        address1: source === "others" ? prev.shipping.address1 : (source === "billing" ? src.address1 : details.participant.address1),
        address2: source === "others" ? prev.shipping.address2 : (source === "billing" ? src.address2 : details.participant.address2),
        country: source === "others" ? prev.shipping.country : (source === "billing" ? src.country : details.participant.country),
        state: source === "others" ? prev.shipping.state : (source === "billing" ? (src as any).state : details.participant.state),
        city: source === "others" ? prev.shipping.city : (source === "billing" ? (src as any).city : details.participant.city),
        pincode: source === "others" ? prev.shipping.pincode : (source === "billing" ? src.pincode : details.participant.pincode),
      },
    }));
  };

  const isInitialLoading = fetchingCart || fetchingProfile;

  return (
    <div className={`space-y-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      {/* ─── TOAST ─── */}
      <div className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${showNotification ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"}`}>
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl ${notificationType === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
          {notificationType === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{notificationMessage}</p>
          <button onClick={() => setShowNotification(false)} className="ml-2 p-0.5 rounded hover:bg-white/10"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* ─── REMOVE MODAL ─── */}
      {removeConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-[#0d1a2d] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/50 via-red-400 to-red-500/50" />
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"><Trash2 className="w-6 h-6 text-red-400" /></div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-white">Remove from Cart?</h3>
                <p className="text-sm text-slate-400">Remove <span className="text-white font-medium">{removeConfirm.programName}</span>?</p>
              </div>
              <div className="flex items-center gap-3 w-full pt-2">
                <button onClick={() => setRemoveConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-all">Cancel</button>
                <button onClick={() => removeItem(removeConfirm)} disabled={removingId === removeConfirm._id} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-all disabled:opacity-50">
                  {removingId === removeConfirm._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── BREADCRUMB ─── */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard/pt-programs" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-300 transition-all">
          <ArrowLeft className="w-3.5 h-3.5" />Continue Shopping
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300 font-medium">Checkout</span>
      </div>

      {/* ─── HEADER ─── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {items.length > 0 ? `${items.length} program${items.length > 1 ? "s" : ""} • Step ${currentStep + 1} of ${CHECKOUT_STEPS.length}` : "Review and complete your purchase"}
          </p>
        </div>
      </div>

      {/* ─── LOADING ─── */}
      {isInitialLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
          <p className="text-sm text-slate-400">Loading checkout details...</p>
        </div>
      )}

      {/* ─── EMPTY CART ─── */}
      {!isInitialLoading && items.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
          <div className="h-[2px] bg-gradient-to-r from-[#0A3D62] via-[#00B4D8] to-[#90E0EF] opacity-40" />
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center"><PackageOpen className="w-10 h-10 text-slate-600" /></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#0d1a2d] border border-white/[0.06] flex items-center justify-center"><ShoppingCart className="w-4 h-4 text-slate-500" /></div>
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <h3 className="text-lg font-semibold text-slate-200">Your cart is empty</h3>
              <p className="text-sm text-slate-500">Browse our PT programs catalog to get started.</p>
            </div>
            <Link href="/dashboard/pt-programs" className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Beaker className="w-4 h-4" />Browse PT Programs
              <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>
        </div>
      )}

      {/* ─── MAIN CHECKOUT ─── */}
      {!isInitialLoading && items.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* ─── LEFT: STEP CONTENT (3 cols) ─── */}
          <div className="xl:col-span-3 space-y-6">

            {/* ─── STEPPER BAR ─── */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-4">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {CHECKOUT_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  const isCompleted = index < currentStep && isStepComplete(index);
                  const isPast = index < currentStep;

                  return (
                    <div key={step.id} className="flex items-center flex-shrink-0">
                      <button
                        onClick={() => { if (isPast || isActive) setCurrentStep(index); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                          isActive
                            ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                            : isCompleted
                            ? "text-emerald-400 hover:bg-emerald-500/5 cursor-pointer"
                            : isPast
                            ? "text-slate-400 hover:bg-white/[0.03] cursor-pointer"
                            : "text-slate-600 cursor-default"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                          isActive ? "bg-[#00B4D8]/20" : isCompleted ? "bg-emerald-500/10" : "bg-white/[0.04]"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="hidden md:inline">{step.label}</span>
                      </button>
                      {index < CHECKOUT_STEPS.length - 1 && (
                        <div className={`w-6 h-[2px] mx-1 rounded-full flex-shrink-0 ${isPast ? "bg-emerald-500/30" : "bg-white/[0.06]"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profile Prefill Notice */}
            {profileLoaded && currentStep >= 1 && currentStep <= 4 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00B4D8]/[0.04] border border-[#00B4D8]/10">
                <BadgeCheck className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                <p className="text-xs text-slate-400">
                  Details have been pre-filled from your profile. Please review and update if needed for this order.
                </p>
              </div>
            )}

            {/* ═══ STEP 0: CART REVIEW ═══ */}
            {currentStep === 0 && (
              <StepCard icon={ShoppingCart} title="Review Your Cart" subtitle={`${items.length} program${items.length > 1 ? "s" : ""} selected`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-10">#</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">Program</th>
                        <th className="px-4 py-3 text-right text-[11px] font-semibold tracking-wider uppercase text-slate-500">Fee</th>
                        <th className="px-4 py-3 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {items.map((item, i) => (
                        <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3"><span className="text-slate-500 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center flex-shrink-0"><Beaker className="w-4 h-4 text-[#90E0EF]" /></div>
                              <div>
                                <p className="font-semibold text-white text-sm">{item.programName}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {item.programId?.slice(-8) || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-[#00B4D8]" /><span className="text-lg font-bold text-white tabular-nums">{item.fees.toLocaleString("en-IN")}</span></div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => setRemoveConfirm(item)} disabled={removingId === item._id} className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-red-400/60 bg-red-500/[0.04] border border-red-500/[0.08] hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-30">
                              {removingId === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </StepCard>
            )}

            {/* ═══ STEP 1: PARTICIPANT ═══ */}
            {currentStep === 1 && (
              <StepCard icon={Building2} title="Participant Details" subtitle="Laboratory / organization placing the order">
                <FormGrid>
                  <FInput icon={Building2} label="Lab / Organization Name" required value={details.participant.name} onChange={(v) => handleChange("participant", "name", v)} placeholder="Enter lab name" colSpan={2} />
                  <FInput icon={MapPin} label="Address Line 1" required value={details.participant.address1} onChange={(v) => handleChange("participant", "address1", v)} placeholder="Street address" />
                  <FInput icon={MapPin} label="Address Line 2" value={details.participant.address2} onChange={(v) => handleChange("participant", "address2", v)} placeholder="Apt, suite (optional)" />
                  <FSelect icon={Globe} label="Country" options={["India"]} value={details.participant.country} onChange={(v) => handleChange("participant", "country", v)} />
                  <FSelect icon={MapPin} label="State" options={INDIAN_STATES} value={details.participant.state} onChange={(v) => handleChange("participant", "state", v)} placeholder="Select State" />
                  <FInput icon={MapPin} label="City" required value={details.participant.city} onChange={(v) => handleChange("participant", "city", v)} placeholder="Enter city" />
                  <FInput icon={Hash} label="Pincode" required value={details.participant.pincode} onChange={(v) => handleChange("participant", "pincode", v)} placeholder="e.g. 201310" maxLength={6} />
                  <FInput icon={FileText} label="GSTIN" value={details.participant.gstin} onChange={(v) => handleChange("participant", "gstin", v.toUpperCase())} placeholder="e.g. 22AAAAA0000A1Z5" mono maxLength={15} />
                  <FInput icon={FileText} label="PAN No" value={details.participant.pan} onChange={(v) => handleChange("participant", "pan", v.toUpperCase())} placeholder="e.g. ABCDE1234F" mono maxLength={10} />
                </FormGrid>
              </StepCard>
            )}

            {/* ═══ STEP 2: BILLING ═══ */}
            {currentStep === 2 && (
              <StepCard icon={CreditCard} title="Billing Details" subtitle="Invoice and billing address">
                <div className="mb-5">
                  <ToggleButton label="Same as Participant Details" checked={details.billing.sameAsParticipant} onChange={handleBillingSameAs} />
                </div>
                <div className={`transition-all duration-500 ${details.billing.sameAsParticipant ? "opacity-40 pointer-events-none" : ""}`}>
                  <FormGrid>
                    <FInput icon={Building2} label="Company Name" required value={details.billing.companyName} onChange={(v) => handleChange("billing", "companyName", v)} placeholder="Billing company" colSpan={2} />
                    <FInput icon={MapPin} label="Address Line 1" required value={details.billing.address1} onChange={(v) => handleChange("billing", "address1", v)} placeholder="Billing address" />
                    <FInput icon={MapPin} label="Address Line 2" value={details.billing.address2} onChange={(v) => handleChange("billing", "address2", v)} placeholder="Optional" />
                    <FSelect icon={Globe} label="Country" options={["India"]} value={details.billing.country} onChange={(v) => handleChange("billing", "country", v)} />
                    <FSelect icon={MapPin} label="State" options={INDIAN_STATES} value={details.billing.state} onChange={(v) => handleChange("billing", "state", v)} placeholder="Select State" />
                    <FInput icon={MapPin} label="City" required value={details.billing.city} onChange={(v) => handleChange("billing", "city", v)} placeholder="Enter city" />
                    <FInput icon={Hash} label="Pincode" required value={details.billing.pincode} onChange={(v) => handleChange("billing", "pincode", v)} placeholder="e.g. 201310" maxLength={6} />
                    <FInput icon={FileText} label="GSTIN" value={details.billing.gstin} onChange={(v) => handleChange("billing", "gstin", v.toUpperCase())} placeholder="GSTIN" mono maxLength={15} />
                    <FInput icon={FileText} label="PAN No" value={details.billing.pan} onChange={(v) => handleChange("billing", "pan", v.toUpperCase())} placeholder="PAN" mono maxLength={10} />
                  </FormGrid>
                </div>
              </StepCard>
            )}

            {/* ═══ STEP 3: SHIPPING ═══ */}
            {currentStep === 3 && (
              <StepCard icon={Truck} title="Shipping Details" subtitle="Where PT items should be delivered">
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { value: "participant", label: "Same as Participant" },
                    { value: "billing", label: "Same as Billing" },
                    { value: "others", label: "Other Address" },
                  ].map((opt) => (
                    <button key={opt.value} type="button" onClick={() => handleShippingSameAs(opt.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        details.shipping.sameAs === opt.value
                          ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                          : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.05]"
                      }`}>
                      <CircleDot className={`w-4 h-4 ${details.shipping.sameAs === opt.value ? "text-[#00B4D8]" : "text-slate-600"}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
                <FormGrid>
                  <FInput icon={UserCog} label="Shipping Person Name" required value={details.shipping.personName} onChange={(v) => handleChange("shipping", "personName", v)} placeholder="Contact person for delivery" colSpan={2} />
                  <FInput icon={MapPin} label="Address Line 1" required value={details.shipping.address1} onChange={(v) => handleChange("shipping", "address1", v)} placeholder="Delivery address" />
                  <FInput icon={MapPin} label="Address Line 2" value={details.shipping.address2} onChange={(v) => handleChange("shipping", "address2", v)} placeholder="Optional" />
                  <FSelect icon={Globe} label="Country" options={["India"]} value={details.shipping.country} onChange={(v) => handleChange("shipping", "country", v)} />
                  <FSelect icon={MapPin} label="State" options={INDIAN_STATES} value={details.shipping.state} onChange={(v) => handleChange("shipping", "state", v)} placeholder="Select State" />
                  <FInput icon={MapPin} label="City" required value={details.shipping.city} onChange={(v) => handleChange("shipping", "city", v)} placeholder="Enter city" />
                  <FInput icon={Hash} label="Pincode" required value={details.shipping.pincode} onChange={(v) => handleChange("shipping", "pincode", v)} placeholder="Pincode" maxLength={6} />
                </FormGrid>
              </StepCard>
            )}

            {/* ═══ STEP 4: CONTACT PERSON ═══ */}
            {currentStep === 4 && (
              <StepCard icon={Phone} title="Contact Person for this PT" subtitle="Person responsible for this PT program order">
                <FormGrid>
                  <FInput icon={UserCog} label="Contact Person Name" required value={details.contact.name} onChange={(v) => handleChange("contact", "name", v)} placeholder="Full name" />
                  <FInput icon={Briefcase} label="Designation" required value={details.contact.designation} onChange={(v) => handleChange("contact", "designation", v)} placeholder="e.g. Lab Manager" />
                  <FInput icon={Smartphone} label="Mobile Number" required value={details.contact.mobile} onChange={(v) => handleChange("contact", "mobile", v)} placeholder="+91 XXXXX XXXXX" maxLength={13} />
                  <FInput icon={Mail} label="Email Address" required value={details.contact.email} onChange={(v) => handleChange("contact", "email", v)} placeholder="email@example.com" />
                  <FInput icon={Mail} label="Alternate Email" value={details.contact.alternateEmail} onChange={(v) => handleChange("contact", "alternateEmail", v)} placeholder="Optional" colSpan={2} />
                </FormGrid>
              </StepCard>
            )}

            {/* ═══ STEP 5: TRANSPORT ═══ */}
            {currentStep === 5 && (
              <StepCard icon={Package} title="Preferred Mode of Transport" subtitle="Select how you'd like to receive PT items">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {TRANSPORT_MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    const isSelected = details.transport.preferredMode === mode.value;
                    return (
                      <button key={mode.value} type="button" onClick={() => handleChange("transport", "preferredMode", mode.value)}
                        className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl text-center transition-all duration-300 ${
                          isSelected
                            ? "bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 shadow-lg shadow-[#00B4D8]/5"
                            : "bg-white/[0.02] border-2 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
                        }`}>
                        {isSelected && <div className="absolute top-2 right-2"><CheckCircle2 className="w-4 h-4 text-[#00B4D8]" /></div>}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isSelected ? "bg-[#00B4D8]/20 text-[#00B4D8]" : "bg-white/[0.04] text-slate-500 group-hover:text-slate-300"
                        }`}>
                          <ModeIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isSelected ? "text-[#90E0EF]" : "text-slate-300"}`}>{mode.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{mode.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <FileText className="w-3 h-3 text-slate-500" />
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={details.transport.specialInstructions}
                    onChange={(e) => handleChange("transport", "specialInstructions", e.target.value)}
                    placeholder="Any special handling or delivery instructions..."
                    rows={3}
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all resize-none"
                  />
                </div>
              </StepCard>
            )}

            {/* ═══ STEP 6: REVIEW & PAY ═══ */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <StepCard icon={BadgeCheck} title="Review Your Order" subtitle="Verify all details before payment">
                  <div className="space-y-6">
                    {/* Cart Summary */}
                    <ReviewSection title="Programs" icon={Beaker} onEdit={() => setCurrentStep(0)}>
                      {items.map((item, i) => (
                        <div key={item._id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2"><span className="text-slate-500 font-mono text-xs">{i + 1}.</span><span className="text-sm text-slate-300">{item.programName}</span></div>
                          <span className="text-sm text-white font-semibold tabular-nums">₹{item.fees.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </ReviewSection>

                    {/* Participant */}
                    <ReviewSection title="Participant" icon={Building2} onEdit={() => setCurrentStep(1)}>
                      <ReviewRow label="Lab Name" value={details.participant.name} />
                      <ReviewRow label="Address" value={[details.participant.address1, details.participant.address2].filter(Boolean).join(", ")} />
                      <ReviewRow label="Location" value={`${details.participant.city}, ${details.participant.state} - ${details.participant.pincode}`} />
                      {details.participant.gstin && <ReviewRow label="GSTIN" value={details.participant.gstin} mono />}
                    </ReviewSection>

                    {/* Billing */}
                    <ReviewSection title="Billing" icon={CreditCard} onEdit={() => setCurrentStep(2)} badge={details.billing.sameAsParticipant ? "Same as Participant" : undefined}>
                      <ReviewRow label="Company" value={details.billing.companyName} />
                      <ReviewRow label="Address" value={[details.billing.address1, details.billing.address2].filter(Boolean).join(", ")} />
                      <ReviewRow label="Location" value={`${details.billing.city}, ${details.billing.state} - ${details.billing.pincode}`} />
                    </ReviewSection>

                    {/* Shipping */}
                    <ReviewSection title="Shipping" icon={Truck} onEdit={() => setCurrentStep(3)} badge={details.shipping.sameAs !== "others" ? `Same as ${details.shipping.sameAs}` : undefined}>
                      <ReviewRow label="Person" value={details.shipping.personName} />
                      <ReviewRow label="Address" value={[details.shipping.address1, details.shipping.address2].filter(Boolean).join(", ")} />
                      <ReviewRow label="Location" value={`${details.shipping.city}, ${details.shipping.state} - ${details.shipping.pincode}`} />
                    </ReviewSection>

                    {/* Contact */}
                    <ReviewSection title="Contact Person" icon={Phone} onEdit={() => setCurrentStep(4)}>
                      <ReviewRow label="Name" value={details.contact.name} />
                      <ReviewRow label="Designation" value={details.contact.designation} />
                      <ReviewRow label="Mobile" value={details.contact.mobile} />
                      <ReviewRow label="Email" value={details.contact.email} />
                    </ReviewSection>

                    {/* Transport */}
                    <ReviewSection title="Transport" icon={Package} onEdit={() => setCurrentStep(5)}>
                      <ReviewRow label="Mode" value={TRANSPORT_MODES.find((m) => m.value === details.transport.preferredMode)?.label || "—"} />
                      {details.transport.specialInstructions && <ReviewRow label="Instructions" value={details.transport.specialInstructions} />}
                    </ReviewSection>
                  </div>
                </StepCard>
              </div>
            )}

            {/* ─── NAVIGATION BUTTONS ─── */}
            <div className="flex items-center justify-between pt-2">
              <button onClick={goBack} disabled={currentStep === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />Previous
              </button>

              {currentStep < CHECKOUT_STEPS.length - 1 ? (
                <button onClick={goNext}
                  className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Next Step
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button onClick={handlePayment} disabled={loading}
                  className="group relative flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden"><div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} /></div>
                  <div className="relative flex items-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    <span>{loading ? "Processing..." : "Pay Securely"}</span>
                    {!loading && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* ─── RIGHT: ORDER SUMMARY SIDEBAR ─── */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Wallet className="w-4 h-4" />Summary</h2>

              <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
                <div className="h-[2px] bg-gradient-to-r from-[#0A3D62] via-[#00B4D8] to-[#90E0EF]" />
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#00B4D8]/5 blur-3xl" />

                <div className="relative p-5 space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00B4D8]/50 flex-shrink-0" />
                          <span className="text-xs text-slate-400 truncate">{item.programName}</span>
                        </div>
                        <span className="text-xs text-slate-300 font-medium tabular-nums whitespace-nowrap">₹{item.fees.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-xs text-slate-400">Subtotal</span><span className="text-xs text-slate-200 font-semibold tabular-nums">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1"><span className="text-xs text-slate-400">GST</span><span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">18%</span></div>
                      <span className="text-xs text-slate-200 font-semibold tabular-nums">₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Total</span>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-[#00B4D8]" />
                      <span className="text-xl font-bold text-white tabular-nums">{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center">Including all taxes</p>
                </div>
              </div>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 py-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <p className="text-[11px] text-slate-500">Secured by <span className="text-slate-400 font-medium">Razorpay</span></p>
              </div>

              {/* Help */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#00B4D8]/[0.04] border border-[#00B4D8]/10">
                <Info className="w-4 h-4 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Need help? <Link href="/dashboard/enquiry" className="text-[#00B4D8] hover:text-[#90E0EF] font-medium">Contact support</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */

function StepCard({ icon: Icon, title, subtitle, children }: { icon: any; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
      <div className="h-[2px] bg-gradient-to-r from-[#0A3D62] via-[#00B4D8] to-[#90E0EF] opacity-60" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#00B4D8]/[0.02] blur-3xl" />
      <div className="relative p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/15 flex items-center justify-center"><Icon className="w-5 h-5 text-[#00B4D8]" /></div>
          <div><h2 className="text-base font-semibold text-white">{title}</h2><p className="text-xs text-slate-500">{subtitle}</p></div>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function FInput({ icon: Icon, label, required, value, onChange, placeholder, mono, colSpan, maxLength }: {
  icon: any; label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean; colSpan?: number; maxLength?: number;
}) {
  return (
    <div className={colSpan === 2 ? "md:col-span-2" : ""}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        <Icon className="w-3 h-3 text-slate-500" />{label}{required && <span className="text-red-400 text-[10px]">*</span>}
        {value?.trim() && <CheckCircle2 className="w-3 h-3 text-emerald-500/50 ml-auto" />}
      </label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        className={`w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all ${mono ? "font-mono" : ""}`} />
    </div>
  );
}

function FSelect({ icon: Icon, label, options, value, onChange, placeholder }: {
  icon: any; label: string; options: string[]; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        <Icon className="w-3 h-3 text-slate-500" />{label}
        {value?.trim() && <CheckCircle2 className="w-3 h-3 text-emerald-500/50 ml-auto" />}
      </label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all cursor-pointer">
          {placeholder && <option value="" className="bg-[#0d1a2d] text-slate-400">{placeholder}</option>}
          {options.map((o) => <option key={o} value={o} className="bg-[#0d1a2d] text-white">{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

function ToggleButton({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        checked ? "bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#90E0EF]" : "bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:bg-white/[0.04]"
      }`}>
      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${checked ? "bg-[#00B4D8] text-white" : "bg-white/[0.06] border border-white/[0.1]"}`}>
        {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
      {label}
    </button>
  );
}

function ReviewSection({ title, icon: Icon, onEdit, badge, children }: {
  title: string; icon: any; onEdit: () => void; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#00B4D8]" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {badge && (
            <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#00B4D8]/10 border border-[#00B4D8]/15 text-[#90E0EF] font-semibold">{badge}</span>
          )}
        </div>
        <button onClick={onEdit} className="flex items-center gap-1 text-[11px] text-[#00B4D8] hover:text-[#90E0EF] font-medium transition-colors">
          <Edit3 className="w-3 h-3" />Edit
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value?.trim()) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-slate-500 flex-shrink-0">{label}</span>
      <span className={`text-xs text-slate-300 text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}