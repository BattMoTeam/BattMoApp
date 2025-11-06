import Image from "next/image" 
import Link from "next/link"

export default function Logo() {
  return (
    <Image
      src="https://raw.githubusercontent.com/BattMoTeam/visual-identity/1bc87b07605d77fb3faa788c82f06ec2735ed31f/logos/battmo_logo_side.png" // put file inside /public/logo.png
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
      <img src="https://raw.githubusercontent.com/BattMoTeam/visual-identity/1bc87b07605d77fb3faa788c82f06ec2735ed31f/logos/battmo_logo_side.png" alt="Logo" className=" w-50" />
    </Link>
  );
}
