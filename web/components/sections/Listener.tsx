import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Listener() {
  return (
    <section id="how" className="py-24 px-4 sm:px-8 md:px-16">
      <div className="container mx-auto flex flex-col items-center gap-12 sm:gap-16 md:gap-24">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-center leading-tight">
          Empathy.{" "}
          <span className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-transparent bg-clip-text">
            Connection.
          </span>{" "}
          Growth.
        </h2>
        <p className="text-lg mb-8 font-normal text-center">
          At Heartly, we believe that everyone has the power to make a
          difference simply by listening. Join us as a listener and help create
          a safe space for those seeking support, guidance, or just a friendly
          ear.
        </p>

        {/* Two boxes container */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* First Box */}
          <div className="rounded-2xl p-8 bg-white shadow-[0_0_20px_rgba(254,191,93,0.2)] hover:shadow-[0_0_25px_rgba(255,162,201,0.3)] transition-shadow">
            <h3 className="text-2xl font-semibold mb-6">
              Why Become a Listener?
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-medium mb-2">
                  💥 Make a Meaningful Impact
                </h4>
                <p>
                  Provide support and encouragement to someone in need. Your
                  time can transform lives.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-medium mb-2">
                  🔗 Foster Real Connections
                </h4>
                <p>
                  Build genuine, anonymous connections with people seeking to be
                  heard.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-medium mb-2">
                  🏆 Champion Privacy and Respect
                </h4>
                <p>
                  Heartly ensures all interactions are secure, respectful, and
                  free from judgment.
                </p>
              </div>
            </div>
          </div>

          {/* Second Box */}
          <div className="rounded-2xl p-8 bg-white shadow-[0_0_20px_rgba(254,191,93,0.2)] hover:shadow-[0_0_25px_rgba(255,162,201,0.3)] transition-shadow">
            <h3 className="text-2xl font-semibold mb-6">
              Heartly Listener Benefits
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-medium mb-2">
                  🤝 Flexible Participation
                </h4>
                <p>
                  Choose your availability and connect at times that suit you.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-medium mb-2">
                  💪 A Safe, Supportive Environment
                </h4>
                <p>
                  Heartly provides a secure space for meaningful conversations.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-medium mb-2">
                  🎖️ Recognition of Impact
                </h4>
                <p>
                  Be part of a growing community of listeners making a real
                  difference in people&apos;s lives.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-16">
          <h2 className="text-3xl font-semibold mb-8">How to Get Started</h2>

          <div className="flex flex-col items-center gap-8">
            <div className="max-w-md">
              <h3 className="text-xl font-medium mb-2">
                1. Sign Up as a Listener 🎧
              </h3>
              <p>Create a profile and indicate your availability for calls.</p>
            </div>

            <div className="max-w-md">
              <h3 className="text-xl font-medium mb-2">
                2. Connect Anonymously 🥷{" "}
              </h3>
              <p>
                Our platform matches you with users seeking someone to talk to,
                ensuring complete anonymity.
              </p>
            </div>

            <div className="max-w-md">
              <h3 className="text-xl font-medium mb-2">
                3. Support and Grow ❤️
              </h3>
              <p>
                Help others navigate their challenges while enhancing your own
                listening skills.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-8 bg-white shadow-[0_0_20px_rgba(254,191,93,0.2)] hover:shadow-[0_0_25px_rgba(255,162,201,0.3)] transition-shadow max-w-3xl mx-auto text-center mt-16">
          <p className="text-xl mb-8">
            Listening is the first step to understanding. Join our listener
            community today and be a voice of comfort and support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://tripetto.app/run/X6PZRUDEGB">
              <Button className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-white hover:from-[#FFA2C9] hover:to-[#FEBF5D]">
                Become a Listener Now
              </Button>
            </Link>

            <Link href="https://tripetto.app/run/X6PZRUDEGB">
              <Button
                variant="outline"
                className="border-2 border-[#FFA2C9] text-[#FFA2C9] hover:bg-[#FFA2C9] hover:text-white"
              >
                Learn More About Heartly
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
