import React from "react";
import Link from "next/link";

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = "w-36",
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-primary-6000 focus:outline-none focus:ring-0 ${className}`}
    >
      <img
        className="block max-h-20"
        src="/logo.png"
        alt="Logo HOLYDEO"
      />
    </Link>
  );
};

export default Logo;
