import Image from "next/image" 
import Link from "next/link"

export default function Logo() {
  return (
    <Image
      src="battmo_logo_text.png"
      alt="My Logo"
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
      <img src="/battmo_logo_text.png" alt="Logo" className=" w-50" />
    </Link>
  );
}
