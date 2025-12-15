'use client';

import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/ui/button";


export default function ExploreSimulatorButton() {
    const router = useRouter();
  return (
    <div className="explore-simulator-button">
        <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white text-md p-4 shadow-lg"
            onClick={() => router.push("/simulator")}
            >
            Explore the Simulator 
            <MoveRight className="size-5"/>
        </Button>
    </div>
    
  );
}