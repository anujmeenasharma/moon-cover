import ScrambleText from "../../UiComponents/ScrambleText";

const Conversations = () => {
  return (
    <div className="h-screen w-full flex px-32 relative overflow-hidden z-20">
      <div className="h-screen w-full py-32 flex flex-col justify-between">
        {/* <h1 className="text-4xl uppercase font-black telegraf w-[50%]">
          Brands Are Cultural Conversations
        </h1> */}
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
            className="w-[30%] h-[30%] relative right-6"
          />
          <div className="flex flex-col gap-12">
            <div className="w-[50%] text-[#D1E40F] relative whitespace-pre-line">
              <ScrambleText
                textSize="xl"
                text="Modern consumers demand authenticity."
              />
            </div>
            {/* <h1 className="text-xl uppercase font-black telegraf text-[#D1E40F] w-[50%]">Modern consumers demand authenticity.</h1> */}
            <p className="text-xs font-light w-[50%]">
              We build brands fluent in the language of today's culture: real,
              relevant, and rooted in genuine utility.
            </p>
          </div>
        </div>
      </div>
      <div className="h-screen w-full py-32 flex flex-col justify-between">
        <span></span>
        <div className="flex flex-col items-center gap-16">
          <img
            src="/Cpu.svg"
            alt="conversation"
            className="w-[30%] h-[30%] relative right-[5rem]"
          />
          <div className="flex flex-col items-center gap-12">
            <div className="w-[50%] text-[#D1E40F] relative whitespace-pre-line">
              <ScrambleText
                textSize="xl"
                text="Technology amplifies creativity."
              />
            </div>
            {/* <h1 className="text-xl uppercase font-black telegraf text-[#D1E40F] w-[50%]">
              Technology amplifies creativity.
            </h1> */}
            <p className="text-xs font-light w-[50%]">
              Our AI and data capabilities don't replace human insight—they
              supercharge it, enabling faster iteration and more precise
              targeting.
            </p>
          </div>
        </div>
      </div>
      <div className="h-screen w-full py-32 flex flex-col items-center justify-between">
        <span className="text-xs font-light w-[50%]">
          We start with humans. Their rhythms, their rituals, the quiet truths
          of how they live and what they love. From these insights, we shape
          stories that don't just get seen—they get felt.
        </span>
        <div className="flex flex-col items-center gap-16">
          <img
            src="/network.svg"
            alt="conversation"
            className="w-[30%] h-[30%] relative right-[5rem]"
          />
          <div className="flex flex-col items-center gap-12">
            <div className="w-[50%] text-[#D1E40F] relative whitespace-break-spaces">
              <ScrambleText textSize="xl" text="Permanence over quick wins." />
            </div>
            {/* <h1 className="text-xl uppercase font-black telegraf text-[#D1E40F] w-[50%]">
              Permanence over quick wins.
            </h1> */}
            <p className="text-xs font-light w-[50%]">
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
