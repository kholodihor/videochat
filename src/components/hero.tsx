import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-gray-50">
      {/* Background SVG */}
      <div className=" absolute inset-0 z-0 opacity-100">
        <Image
          src="/conversation.svg"
          alt="Background pattern"
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      </div>
    </div>
  );
}
