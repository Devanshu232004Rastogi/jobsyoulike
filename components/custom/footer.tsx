"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import LogoImg from "@/public/Logo.png";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-5 px-4">
       <p className="text-sm flex justify-center text-gray-500">
            &copy; 2025 JobsYouLike. All rights reserved.
          </p>
    </footer>
  );
};

export default Footer;