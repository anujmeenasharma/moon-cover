import ScrambleText from "../../UiComponents/ScrambleText";

const Conversations = () => {
  return (
    <div className="h-screen w-full flex px-32 relative overflow-hidden z-20">
      <div className="h-screen w-full py-32 flex flex-col justify-between">
        <div className="w-[70%] relative whitespace-pre-line">
          <ScrambleText
            textSize="4xl"
            text="Brands Are Cultural Conversations."
          />
        </div>

        <div className="flex flex-col gap-16">
          <img
            src="/authenticity.svg"
            alt="conversation"
            className="w-16 h-16 object-contain"
          />
          <div className="flex flex-col gap-4">
            <div className="w-[80%] text-[#D1E40F] relative whitespace-pre-line">
              <ScrambleText
                textSize="xl"
                text="Modern consumers demand authenticity."
              />
            </div>
            <p className="text-xs font-light w-[60%]">
              We build brands fluent in the language of today's culture: real,
              relevant, and rooted in genuine utility.
            </p>
          </div>
        </div>
      </div>
      <div className="h-screen w-full py-32 flex flex-col justify-between">
        <span></span>
        <div className="flex flex-col gap-16">
          <img
            src="/Cpu.svg"
            alt="conversation"
            className="w-16 h-16 object-contain"
          />
          <div className="flex flex-col gap-4">
            <div className="w-[80%] text-[#D1E40F] relative whitespace-pre-line">
              <ScrambleText
                textSize="xl"
                text="Technology amplifies creativity."
              />
            </div>
            <p className="text-xs font-light w-[80%]">
              Our AI and data capabilities don't replace human insight—they
              supercharge it, enabling faster iteration and more precise
              targeting.
            </p>
          </div>
        </div>
      </div>
      <div className="h-screen w-full py-32 flex flex-col relative left-24 justify-between">
        <span className="text-xs font-light w-[60%]">
          We start with humans. Their rhythms, their rituals, the quiet truths
          of how they live and what they love. From these insights, we shape
          stories that don't just get seen—they get felt.
        </span>
        <div className="flex flex-col gap-16">
          <img
            src="/network.svg"
            alt="conversation"
            className="w-16 h-16 object-contain"
          />
          <div className="flex flex-col gap-4">
            <div className="w-[60%] text-[#D1E40F] relative whitespace-break-spaces">
              <ScrambleText textSize="xl" text="Permanence over quick wins." />
            </div>
            <p className="text-xs font-light w-[60%]">
              We're not interested in trend-chasing or financial gamesmanship.
              We build brands designed to shape categories and stand the test of
              time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
