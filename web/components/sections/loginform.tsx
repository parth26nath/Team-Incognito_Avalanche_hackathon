"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "@/assets/Logo.png";
import { ConnectWallet } from "@/components/ui/connectButton";
import { Input } from "@/components/ui/input";
import { checkUsernameAvailability } from "@/helpers/auth";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const setAuthUsername = (username: string) => {
  localStorage.setItem("pending_username", username);
};

export const LoginForm = () => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // checking if the user is already logged in
  useEffect(() => {
    const storedUsername = localStorage.getItem("logged_username");

    if (storedUsername && storedUsername !== "" && storedUsername !== "null") {
      setUsername(storedUsername);
      setLoggedIn(true);
    }
  }, []);

  const handleLogIn = async () => {
    if (!loggedIn && isUsernameValid && username.length > 3) {
      setIsLoggingIn(true);
      try {
        // await createUser(username);
        setLoggedIn(true);
      } catch (error) {
        setLoggedIn(false);
        setError("Failed to login. Please try again.");
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const validateUsername = async (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setError("");
    setIsUsernameValid(false);

    if (!value || value.length < 3) {
      if (value.length > 0) {
        setError("Username must be at least 3 characters");
      }
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setIsChecking(true);
      try {
        const result = await checkUsernameAvailability(value);
        if (!result.success) {
          setError(result.error || "Failed to check username");
        } else if (!result.available) {
          setError("Username already taken");
        } else {
          setIsUsernameValid(true);
          setAuthUsername(value);
        }
      } catch (err) {
        setError("Error checking username");
      } finally {
        setIsChecking(false);
      }
    }, 600);
  };

  // const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value.trim();
  //   setUsername(value);
  //   validateUsername(value);
  // };

  // const handleConnect = () => {
  //   if (isUsernameValid && username.length > 3 && openConnectModal) {
  //     openConnectModal();
  //   }
  // };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isClient = useRef(false);

  useEffect(() => {
    isClient.current = true;
  }, []);

  const handleRegisterNewUser = () => {
    localStorage.removeItem("logged_username");
    setLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col justify-center items-center gap-4">
            <Image src={Logo} alt="Logo" className="w-16 h-16" />
            <div className="flex flex-col justify-center items-center">
              <div className="text-3xl font-nunito font-bold">HEARTLY</div>
              <div className="text-xs font-thin">Talk.Heal.Grow</div>
              <div className="text-3xl font-nunito font-bold my-4">
                Welcome Back!
              </div>
            </div>
          </div>
          <p>Continue with a wallet 😊</p>

          <div className="w-full space-y-2">
            {/* <div className="relative">
              <Input
                placeholder="username"
                value={username}
                onChange={handleUsernameChange}
                className={`flex h-12 w-full rounded-lg border ${
                  error
                    ? "border-red-500"
                    : isUsernameValid
                    ? "border-green-500"
                    : "border-input"
                } bg-white px-4 py-2 text-base shadow-sm disabled:cursor-not-allowed transition-colors`}
                disabled={isLoggingIn || loggedIn}
              />
              {isChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {isUsernameValid && !error && (
              <p className="text-sm text-green-500 mt-1">Username available!</p>
            )} */}
          </div>
          {username.length > 0 &&
            !isUsernameValid &&
            !isChecking &&
            !loggedIn && (
              <p className="text-sm text-gray-500">
                Please choose a valid username to continue
              </p>
            )}
          {loggedIn && (
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-gray-500 text-center">
                You are already logged in as {username}.<br />
                Connect your wallet to continue.
              </p>
            </div>
          )}
          {/*           
          {!loggedIn && address ? (
            <button
              onClick={handleLogIn}
              className="bg-gradient-to-r disabled:opacity-70 disabled:cursor-not-allowed from-[#FBB03B] to-[#FBB4D5] text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center min-w-[100px]"
              disabled={!isUsernameValid || username.length < 3 || isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          ) : (
            <ConnectWallet />
          )} */}
          <div className="relative flex items-center justify-center">
            {/* <div
              className={`${
                isUsernameValid || loggedIn
                  ? "hidden"
                  : "z-30 block absolute top-0 left-0 cursor-not-allowed"
              } min-w-full min-h-full opacity-45 bg-white`}
            ></div> */}

            <div className="flex items-center gap-2">
              <ConnectWallet />
            </div>

            {/* register new user */}
          </div>
          {loggedIn && (
            <button
              onClick={handleRegisterNewUser}
              className="bg-none mx-auto mt-1 text-blue-600 px-6 py-2 font-semibold flex items-center justify-center min-w-[100px]"
            >
              Register as new user ?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
