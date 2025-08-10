"use server";

import { getToken } from "@/lib/provider";

export async function checkUsernameAvailability(username: string) {
  try {
    const response = await fetch(
      `https://heartly.live/api/users/check-username/${username}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    // If username is available
    if (response.ok) {
      return {
        success: true,
        available: data.avaiable,
      };
    }

    if (data.error === "User already exists") {
      return {
        success: true,
        available: false,
      };
    }

    // Any other error means something went wrong
    throw new Error(data.error || "Failed to check username");
  } catch (error) {
    console.error("Username check error:", error);
    return {
      success: false,
      error: "Failed to check username availability",
    };
  }
}

export const getUserByUsername = async (username: string) => {
  try {
    const response = await fetch(`https://heartly.live/api/users/username/${username}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    }

    if (data.error === "No user found") {
      return {
        success: true,
        data: null,
      };
    }

    throw new Error(data.error || "Failed to get user by username");
  } catch (error) {
    console.error("User by username error:", error);
    return {
      success: false,
      error: "Failed to get user by username",
    };
  }
}


export const refreshToken = async (walletAddress: string) => {
  const token = getToken();
  if (!token) {
    return {
      success: false,
      error: "No token found",
    };
  }

  try {
    const response = await fetch(
      "https://heartly.live/api/auth/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({
          walletAddress,
        }),
        cache: "no-store",
      } 
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("token", data);
    return { success: true, token: data };
  } catch (error) {
    console.error("Token refresh error:", error);
    return { success: false, error: "Failed to refresh token" };
  }
};


export async function searchUserByAddress(address: string) {
  const token = getToken();
  if (!token) {
    return {
      success: false,
      error: "No token found",
    };
  }
  try {
    const response = await fetch(
      `https://heartly.live/api/users/wallet/${address}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          authorization: `${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    }

    if (data.error === "No user found") {
      return {
        success: true,
        data: null,
      };
    }

    // Any other error means something went wrong
    throw new Error(data.error || "Failed to check username");
  } catch (error) {
    console.error("Username check error:", error);
    return {
      success: false,
      error: "Failed to check username availability",
    };
  }
}

export async function requestNonce(walletAddress: string) {
  try {
    const response = await fetch(
      `https://heartly.live/api/auth/request-nonce`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
        cache: "no-store",
      }
    );
    console.log("resp::", response)
    if (!response.ok) {
      throw new Error("Failed to get nonce");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Nonce request error:", error);
    return { success: false, error: "Failed to get authentication nonce" };
  }
}

export async function verifySignature(params: {
  walletAddress: string;
  signature: string;
  message: string;
  username: string;
}) {
  try {
    const response = await fetch(
      `https://heartly.live/api/auth/verify-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify signature");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Signature verification error:", error);
    return { success: false, error: "Failed to verify signature" };
  }
}

export async function createUser(username: string, walletAddress: string) {
  try {
    const response = await fetch("https://heartly.live/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        walletAddress,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create user");
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("User creation error:", error);
    return {
      success: false,
      error: error.message || "Failed to create user",
    };
  }
}
