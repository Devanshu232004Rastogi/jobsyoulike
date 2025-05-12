import Image from "next/image";
import React from "react";
import LogoImg from "@/public/Logo.png"

const Logo = () => {
  return <Image src={LogoImg} alt="Logo" height={150} width={200}
  />;
};

export default Logo;
