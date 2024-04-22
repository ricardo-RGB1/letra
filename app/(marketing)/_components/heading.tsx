"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your ideas, documents, and plans all in one place,{" "}
        <span className="underline">Letra</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Letra is the connected workspace where <br />
        better work happens.
      </h3>
      <Button>Enter Letra <ArrowRight className="h-4 w-4 ml-2" /> </Button>
    </div>
  );
};

export default Heading;
