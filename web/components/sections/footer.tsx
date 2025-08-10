import { TwitterIcon } from "lucide-react";
import Image from "next/image";
import Rocket from "@/assets/rocket.gif";
import DiscordIcon from "@/assets/discord-logo-icon-editorial-free-vector.jpg";

export function Footer() {
  return (
    <footer className="py-6 px-4 bg-gradient-to-b from-pink-50 to-transparent">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm">Find us on :</span>
            <div className="flex space-x-4">
              <a
                href="https://x.com/heartly_live"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a
                href="https://discord.gg/FEEQsswa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={DiscordIcon}
                  alt="Discord"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            Made with <span className="text-red-500">❤️</span> in{" "}
            <span>🇮🇳</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Built on Web3
            </span>
            <div className="w-12 h-12">
              <Image
                src={Rocket}
                alt="Rocket GIF"
                width={48}
                height={48}
                className="object-cover"
                unoptimized={true}
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Heartly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
