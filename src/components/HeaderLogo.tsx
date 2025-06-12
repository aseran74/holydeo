import Link from "next/link";
import Image from "next/image";

export default function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/Logo3.png"
        alt="Holvdeo"
        width={100}
        height={34}
        style={{ maxWidth: "100%", height: "auto" }}
        priority
      />
    </Link>
  );
} 