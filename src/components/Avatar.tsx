import Image from "next/image";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

function Avatar({ src }: { src?: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded-full"
        width={40}
        height={40}
      />
    );
  }
  return <FaUserCircle size={24} />;
}

export default Avatar;
