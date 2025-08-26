import Image from "next/image";
import Link from "next/link";

export default function LogoBanner() {
  return (
    <div className="logo-banner">
      <Link href="/" aria-label="Go to home" className="logo-link">
        <Image
          src="/logo.jpeg"
          alt="Sister Core"
          width={220}
          height={220}
          priority
        />
      </Link>
    </div>
  );
}
