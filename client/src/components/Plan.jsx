import { PricingTable } from "@clerk/react";

const Plan = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">

      <div className="text-center">
        <h2 className="text-5xl font-bold text-slate-800">
          Choose Your Plan
        </h2>

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Start for free and scale up as you grow.<br/>
          Find the perfect plan for your content creation needs.
        </p>
      </div>

      <div className="mt-16">
        <PricingTable />
      </div>

    </section>
  );
};

export default Plan;