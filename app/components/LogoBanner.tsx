import Image from "next/image";

export default function LogoBanner() {
  return (
    <div className="logo-banner">
      <Image
        src="/logo.jpeg"
        alt="Sister Core ATX"
        width={220}
        height={220}
        priority
      />
    </div>
  );
}
