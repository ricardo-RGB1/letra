"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {
  // extract isAuthenticated and isLoading from the useConvexAuth hook
  const { isAuthenticated, isLoading } = useConvexAuth();

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
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size='lg' />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href='/documents'>
          Enter Letra <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode='modal'>
          <Button>
            Get Letra Free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
