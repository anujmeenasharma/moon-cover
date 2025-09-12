import ScrambleText from "../../UiComponents/ScrambleText";

const Thinking = () => {
  return (
    <div className="h-screen w-full flex justify-center relative z-20">
      <div className="h-screen w-[45vw] flex flex-col justify-center gap-16 px-2">
        <div className="absolute left-[60vw] top-1/3 logo opacity-[0.2] rotate-90 scale-[0.1]">
          <img src="/landingMain.svg" alt="mainLanding" className="w-20" />
        </div>
        <div className="flex flex-col gap-3">
          {/* <h1 className="text-4xl telegraf uppercase font-bold pb-4">
            Beyond traditional thinking
          </h1> */}
          <div className="pb-4 whitespace-nowrap">
            <ScrambleText textSize="4xl" text="Beyond traditional thinking" />
          </div>
          <h3 className="text-sm uppercase font-bold telegraf">
            Why Most Brand "Aggregators" Miss the Point
          </h3>
          <p className="text-sm font-light w-[65%]">
            Traditional approaches prioritize spreadsheets over storytelling.
            They optimize for multiple arbitrage instead of building genuine
            brand equity.
          </p>
        </div>
        <div>
          <p className="text-sm font-light para-text">
            We compound outcomes, not just collect logos. Our focus is
            systematic brand building, not vanity metrics. We bet on emotional
            resonance, not financial engineering. Real value comes from consumer
            love, not leveraged buyouts. We build for meaning and margin
            together. Deep consumer connection drives durable profitability. We
            scale with intelligence, not just capital. Our platform gets
            stronger with every brand we add.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold uppercase telegraf">
            The math is simple
          </h3>
          <p className="text-sm font-light ">
            Brands with authentic consumer connection command premium pricing,
            lower acquisition costs, and higher lifetime value. Everything else
            is just financial engineering.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Thinking;
