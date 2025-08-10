import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/Logo.png";
import { cn } from "@/lib/utils";
interface NavItemProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavItem({ href, children, className }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-semibold text-muted-foreground transition-colors hover:text-primary font-nunito",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  return (
    <nav className="p-4 w-full z-50 bg-background backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between p-5">
        <Link href="/" className="font-semibold text-xl tracking-tight">
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="Logo" className="w-16 h-16" />
            <div className="flex flex-col justify-center items-center">
              <div className="text-3xl font-nunito">HEARTLY</div>
              <div className="text-xs font-thin">Talk.Heal.Grow</div>
            </div>
          </div>
        </Link>
        <div className="flex justify-evenly gap-20">
          <NavItem href="/what">What</NavItem>
          <NavItem href="/why">Why</NavItem>
          <NavItem href="/how">How</NavItem>
        </div>
        
        <div>
          <NavItem href="/knowmore">Know More!</NavItem>
        </div>
      </div>
    </nav>
  );
}
