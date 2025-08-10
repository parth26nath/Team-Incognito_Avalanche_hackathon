"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/Logo.png";
// import Doodle1 from "@/assets/Doodle1.png"; // Add your doodle images here
import Doodle2 from "@/assets/GrowDoodle.png";
import { TwitterIcon } from "lucide-react";
import DiscordIcon from "@/assets/discord-logo-icon-editorial-free-vector.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import emailjs from "emailjs-com";

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

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .label("Email")
    .required(),
  terms_check: Yup.boolean()
    .required("Accept hearty live journey")
    .oneOf([true], "Accept hearty live journey"),
});

export function Hero() {
  const [showJourney, setShowJourney] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleShowJourney = () => {
    setShowJourney(true);
  };

  const handleHideJourney = () => {
    setShowJourney(false);
    reset();
  };

  const handleStartYourJourney = async (values: any) => {
    const { email } = values;
    try {
      setLoading(true);
      const result = await emailjs.send(
        String(process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID), // Service ID
        String(process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID), // Template ID
        {
          from_name: "Hearty Live", // Replace with dynamic fields if needed
          to_name: "Recipient Name",
          message: email,
          reply_to: process.env.NEXT_PUBLIC_TO_EMAIL,
        },
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY // Public Key
      );
      console.log("result::", result);
      console.log("result::", result.status);
      handleHideJourney();
      if (result.status === 200) {
        setIsEmailSent(true);
        setTimeout(() => {
          setIsEmailSent(false);
        }, 3000);
      }
    } catch (error) {
      console.log("error::", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event: any) => {
    const { value } = event.target;
    setValue("email", value, { shouldValidate: true });
  };

  return (
    <div className="relative flex-col items-center justify-center py-16 mt-16">
      <Image
        src={Doodle2}
        alt="Doodle 2"
        className="hidden md:block absolute bottom-16 right-28 z-0 opacity-70"
      />

      {/* Navbar */}
      <nav className="p-4 w-full z-50 bg-background backdrop-blur-sm fixed top-0 left-0 right-0">
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
          <div className="hidden md:flex justify-evenly gap-20">
            <NavItem href="#how">What</NavItem>
            <NavItem href="#why">Why</NavItem>
            <NavItem href="#what">How</NavItem>
          </div>
          <div>
            <div className="absolute top-2 right-2 md:top-8 md:right-8">
              <NavItem
                href="https://tripetto.app/run/X6PZRUDEGB"
                className="whitespace-nowrap absolute top-4 right-4 bg-[#FFA2C9] text-white px-3 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Become a listener
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 font-montserrat py-20 mx-auto relative z-10">
        <h1 className="text-6xl md:text-7xl font-medium tracking-tight mb-4 flex flex-col md:flex-row justify-center items-center gap-3">
          <div>Talk.</div>
          <div className="bg-tertiary p-2 rounded">Heal.</div>
          <div>Grow.</div>
        </h1>
        <p className="text-lg mb-8 font-normal">
          Talk about anything & everything, anonymously.
        </p>
        {/* <Link href="/test">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-white py-2 px-4 rounded hover:bg-gradient-to-r hover:from-[#FFA2C9] hover:to-[#FEBF5D] hover:transition-colors duration-300 font-nunito text-lg"
          >
            Start Your Journey
          </Button>
        </Link> */}
        {/* <Link href="https://tripetto.app/run/X6PZRUDEGB"> */}{" "}
        {/* // Changed from "/test" to "/coming-soon" */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-white py-2 px-4 rounded hover:bg-gradient-to-r hover:from-[#FFA2C9] hover:to-[#FEBF5D] hover:transition-colors duration-300 font-nunito text-lg"
          onClick={handleShowJourney}
        >
          Start Your Journey 🚀
        </Button>
        {/* </Link> */}
        <div className="flex my-4 space-x-4">
          <span className="text-sm">Follow us :</span>
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
      </section>
      {isEmailSent && (
        <div
          id="toast-top-right"
          className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm top-7 right-5 dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
          role="alert"
          style={{
            marginTop: "80px",
          }}
        >
          <div className="text-sm font-normal d-flex flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
              />
            </svg>
            Subscribe successfully.
          </div>
        </div>
      )}

      {/* <div
          id="toast-top-right"
          className="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-md dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
          role="alert"
        >
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
            />
          </svg>
          <div className="ps-4 text-sm font-normal">
            Subscribe successfully.
          </div>
        </div> */}
      <Dialog open={showJourney} onOpenChange={handleHideJourney}>
        <DialogContent className="max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Start Your Journey
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <form onSubmit={handleSubmit(handleStartYourJourney)}>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleEmailChange}
                  className="text-lg"
                />
                {errors?.email?.message && (
                  <span className="text-red-500">{errors?.email?.message}</span>
                )}
                <div className="mb-4">
                  <div className="flex items-center ">
                    <input
                      // {...register("terms_check")}
                      id="default-checkbox"
                      type="checkbox"
                      onChange={(evnt) => {
                        const checked = evnt.target.checked;
                        if (checked) {
                          setValue("terms_check", checked, {
                            shouldValidate: true,
                          });
                        } else {
                          setValue("terms_check", false, {
                            shouldValidate: false,
                          });
                        }
                      }}
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Please check make an start live.
                    </label>
                  </div>
                  {errors?.terms_check?.message && (
                    <span className="text-red-500 ms-5 text-sm">
                      {errors?.terms_check?.message}
                    </span>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white mt-2"
                disabled={loading}
              >
                Submit
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
