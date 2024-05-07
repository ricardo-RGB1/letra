"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image src="/error.svg" height={300} width={300} alt="Error" />
      <Button>
        <Link href="/documents">Go back home</Link>
      </Button>
    </div>
  );
};

export default Error;
