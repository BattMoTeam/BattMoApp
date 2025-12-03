import React from "react";
import Image from "next/image";

const steps = [
  {
    id: 1,
    title: "Choose what you want to do",
    description: "Simulate battery performance or optimize parameters",
    image: "/screenshot-left.png", // replace with your actual image
  },
  {
    id: 2,
    title: "Set up your simulation",
    description: "Build or select a battery cell, define materials and cycling protocol",
    image: "/screenshot-extra.png",
  },
  {
    id: 3,
    title: "Run and explore the results",
    description: "View performance, battery KPIs, compare results, or export",
    image: "/screenshot-center.png",
  },
];

const GetStarted = () => {
  return (
    <section className="w-full bg-secondary py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-16">
          Get <span className="text-primary">started</span>
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold mb-2">
                {step.id}. {step.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6">{step.description}</p>
              <div className="w-full drop-shadow-lg rounded-lg overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={250}
                  className="rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
