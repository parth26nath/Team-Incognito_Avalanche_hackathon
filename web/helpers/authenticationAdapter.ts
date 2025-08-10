// helpers/authenticationAdapter.ts
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { createSiweMessage } from "viem/siwe";
import { v4 as uuidv4 } from "uuid";
import { createUser, checkUsernameAvailability } from "./auth";

let currentAddress = "";
export const setCurrentAddress = (address: string) => {
  currentAddress = address;
};

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    try {
      // First check if user exists
      const usernameFromStorage =
        localStorage.getItem("pending_username") ||
        localStorage.getItem("logged_username");
      const user = await checkUsernameAvailability(usernameFromStorage!);

      // If no user exists, create one with a UUID username
      if (user && user.available) {
        const randomUsername = `user_${uuidv4().substring(0, 8)}`;
        await createUser(usernameFromStorage ?? randomUsername, currentAddress);
      }


      const fetchNonce = async (): Promise<string> => {
        const nonceResponse = await fetch(
          `https://heartly.live/api/auth/request-nonce`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ walletAddress: currentAddress }),
          }
        );

        if (nonceResponse?.status === 400) {
          // Create the user if it doesn't exist
          const userResp = await fetch(`https://heartly.live/api/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletAddress: currentAddress,
            }),
          });

          if (userResp.ok) {
            // Retry fetching nonce after user creation
            return await fetchNonce();
          } else {
            throw new Error("Failed to create user for wallet address");
          }
        }


        if (!nonceResponse.ok) {
          throw new Error("Failed to get nonce");
        }

        const nonceData = await nonceResponse.json();
        return nonceData.nonce;
      };

      // Call the fetchNonce function
      return await fetchNonce();
    } catch (error) {
      console.error("Error in getNonce:", error);
      throw error;
    }
  },

  createMessage: ({ nonce, address, chainId }) => {
    setCurrentAddress(address);
    return createSiweMessage({
      domain: window.location.host,
      address,
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },

  verify: async ({ message, signature }) => {
    try {
      const verifyRes = await fetch(
        `https://heartly.live/api/auth/verify-signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: currentAddress,
            signature,
            message,
          }),
        },
      );

      const verifyData = await verifyRes.json();
      if (verifyData.token) {

        localStorage.setItem("token", `Bearer ${verifyData.token}`);
        const usernameFromStorage = localStorage.getItem("pending_username");
        localStorage.setItem("logged_username", usernameFromStorage!);
        localStorage.removeItem("pending_username");
        window.location.href = "/test/listeners";
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in verify:", error);
      return false;
    }
  },

  signOut: async () => {
    localStorage.removeItem("token");
  },
});
