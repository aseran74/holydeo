import Link from "next/link";
import Image from "next/image";

export default function SidebarLogo() {
  return (
    <div className="flex items-center justify-center py-6">
      <Link href="/">
        <Image
          src="/Logo3.png"
          alt="Holvdeo - Vive fuera de temporada"
          width={180}
          height={60}
          style={{ maxWidth: "100%", height: "auto" }}
          priority
        />
      </Link>
    </div>
  );
} 