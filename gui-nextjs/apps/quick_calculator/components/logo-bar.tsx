
import Logo, { LogoLink } from '@workspace/ui/components/logo';

export default function LogoBar() {
  
  return (
    <header
      id="logo-bar"
      className="bg-card px-18 md:px-22"
    >
      <div className="flex h-50 items-center">
        {/* Left side */}
        <div className="flex flex-1 items-center">

          {/* Logo */}
          <div className="flex items-center ">
            <LogoLink />
          </div>
        </div>

      </div>
    </header>
  );
}