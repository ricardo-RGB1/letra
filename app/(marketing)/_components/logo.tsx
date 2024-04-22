import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
}); 

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image 
                src="/letra.svg"
                height='35'
                width='25'
                alt="Letra Logo"
                className="dark:hidden"
            />
            <Image 
                src="/letra-darkmode.svg"
                height='35'
                width='25'
                alt="Letra Logo"
                className="hidden dark:block"
            />
            <p className={cn("font-semibold", font.className)}>Letra</p>
        </div>
    )
}  