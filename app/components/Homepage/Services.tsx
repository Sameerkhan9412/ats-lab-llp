import React from "react";

const services = [
  {
    title: "Proficiency Testing",
    desc: "Comprehensive PT programs across chemical, mechanical, and biological disciplines to ensure laboratory accuracy.",
    icon: "assignment_turned_in",
  },
  {
    title: "Reference Materials",
    desc: "Certified Reference Materials (CRMs) compliant with ISO 17034 standards for calibration and validation.",
    icon: "science",
  },
  {
    title: "Quality Control",
    desc: "High-standard QC materials designed for routine monitoring and internal quality assurance of testing results.",
    icon: "fact_check",
  },
  {
    title: "Training Services",
    desc: "Expert-led training modules and consultancy to elevate technical competence and regulatory knowledge.",
    icon: "school",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="relative py-8 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 relative">
          {/* Small Label */}
          <span
            className="inline-block mb-2 rounded-full 
    bg-blue-50 px-4 py-1.5 
    text-xs font-semibold tracking-widest uppercase 
    text-blue-600"
          >
            What We Offer
          </span>

          {/* Main Heading */}
          <h2
            className="text-3xl md:text-4xl lg:text-5xl 
    font-extrabold tracking-tight text-slate-800"
          >
            Our Core{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          {/* Description */}
          <p
            className="mt-2 max-w-2xl mx-auto 
    text-base md:text-lg text-slate-600 leading-relaxed"
          >
            Delivering precision-driven laboratory solutions aligned with
            national and international quality standards.
          </p>

          {/* Divider */}
          <div className="mt-4 flex justify-center">
            <span
              className="h-1.5 w-28 rounded-full 
      bg-gradient-to-r from-blue-600 to-cyan-400"
            />
          </div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
  key={idx}
  className="group relative rounded-2xl 
  bg-gradient-to-br from-blue-600 to-cyan-500
  p-8 text-white
  shadow-[0_10px_30px_rgba(0,0,0,0.15)]
  transition-all duration-300
  hover:-translate-y-2
  hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)]"
>
  {/* Icon */}
  <div
    className="w-16 h-16 mb-6 flex items-center justify-center 
    rounded-xl bg-white text-blue-600 shadow-md
    transition-transform duration-300
    group-hover:scale-105"
  >
    <span className="material-icons text-3xl">
      {service.icon}
    </span>
  </div>

  {/* Content */}
  <h3 className="text-xl font-bold mb-3">
    {service.title}
  </h3>

  <p className="text-sm leading-relaxed text-white/90 mb-6">
    {service.desc}
  </p>

  {/* CTA */}
  <a
  href="#"
  className="group/btn inline-flex items-center gap-2 
  rounded-full border border-white/30 
  bg-white/10 px-5 py-2.5
  text-sm font-semibold
  text-white
  backdrop-blur-md
  transition-all duration-300
  hover:bg-white"
>
  <span className="transition-colors duration-300 group-hover/btn:text-blue-600">
    Learn More
  </span>

  <span
    className="material-icons text-base transition-transform duration-300 
    group-hover/btn:translate-x-1 group-hover/btn:text-blue-600"
  >
    arrow_forward
  </span>
</a>


  {/* Soft depth layer */}
  <div
    className="absolute inset-0 rounded-2xl 
    bg-white/5 opacity-0 
    group-hover:opacity-100 transition pointer-events-none"
  />
</div>

          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
