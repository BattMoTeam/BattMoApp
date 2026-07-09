import Image from "next/image";
import ExploreSimulatorButton from "@workspace/ui/components/explore-simulator-button";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-8rem)] overflow-hidden bg-gray-50">
      <div className="absolute inset-0 flex items-center justify-center p-20">
        <div className="relative mx-auto w-full max-w-5xl px-4">
          <div className="absolute top-8 left-0 hidden w-[30%] drop-shadow-xl md:block">
            <Image
              src="/screenshot-left.png"
              alt="BattMo parameter controls"
              width={500}
              height={400}
              className="rounded-xl"
            />
          </div>

          <div className="relative z-10 mx-auto w-[88%] drop-shadow-2xl md:w-[50%]">
            <Image
              src="/screenshot-center.png"
              alt="BattMo simulator preview"
              width={900}
              height={640}
              className="rounded-xl"
            />
          </div>

          <div className="absolute top-8 right-0 hidden w-[30%] drop-shadow-xl md:block">
            <Image
              src="/screenshot-right.png"
              alt="BattMo results overview"
              width={500}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-6 px-8 pb-10 md:flex-row md:items-end md:justify-between md:px-12 md:pb-12">
        <div className="max-w-lg">
          <h1 className="mb-4 text-5xl font-bold text-primary">BattMo</h1>
          <p className="text-lg text-gray-700">
            An interactive simulator for designing and optimizing electrochemical
            devices.
          </p>
        </div>

        <div className="self-start md:self-auto">
          <ExploreSimulatorButton />
        </div>
      </div>
    </section>
  );
}
