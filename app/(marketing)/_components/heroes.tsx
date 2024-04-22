import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center gap-x-8">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
          <Image
            src="/documents.svg" 
            fill
            className="object-contain"
            alt="Documents"
          />
        </div>
        <div className="relative h-[350px] w-[350px] hidden md:block">
            <Image
                src="/reading.svg"
                fill
                className="object-contain"
                alt="Reading"
            />
        </div>
      </div>
    </div>
  );
};
