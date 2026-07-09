import Image from "next/image" 
import Link from "next/link"

export default function Logo() {
  return (
    <Image
      src="/battmo_logo_text.png"
      alt="BattMo"
      width={150}
      height={60}
    />
  )
}


export function LogoLink() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 p-2 text-primary"
    >
      <img src="/battmo_logo_text.png" alt="BattMo" className="w-44" />
    </Link>
  );
}
