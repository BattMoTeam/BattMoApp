"use client"
import React from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/ui/button";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Hero = () => {
    const router = useRouter();
  return (
    <section className="relative w-full h-[calc(100vh-8rem)] bg-gray-50 overflow-hidden">
      {/* Centered screenshots */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-5xl mx-auto px-4 -mt-16"> 
          {/* Shifted upwards with -mt-16 */}
          
          {/* Left screenshot */}
          <div className="absolute top-8 left-0 w-[30%] drop-shadow-xl">
            <Image
              src="/screenshot-left.png"
              alt="Screenshot Left"
              width={500}
              height={400}
              className="rounded-xl"
            />
          </div>

          {/* Middle screenshot */}
          <div className="relative z-10 mx-auto w-[50%] drop-shadow-2xl">
            <Image
              src="/screenshot-center.png"
              alt="Screenshot Center"
              width={600}
              height={450}
              className="rounded-xl"
            />
          </div>

          {/* Right screenshot */}
          <div className="absolute top-8 right-0 w-[30%] drop-shadow-xl">
            <Image
              src="/screenshot-right.png"
              alt="Screenshot Right"
              width={500}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end px-12 pb-12">
        {/* Title & Description */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-primary mb-4">BattMo</h1>
          <p className="text-lg text-gray-700">
            An interactive simulator for designing and optimizing lithium
            batteries.
          </p>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white text-md p-4 shadow-lg"
          onClick={() => router.push("/simulator")}
        >
          Explore the Simulator 
          <MoveRight className="size-5"/>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
