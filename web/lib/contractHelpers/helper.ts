import { publicClient } from "../client";
import { CONTRACT_ABI, CONTRACT_ADDRESS, USDC_ADDRESS } from "../consts";
import { createWalletClient, custom } from "viem";
import { base, baseSepolia } from "viem/chains";

// Function to get wallet client only on client side
const getWalletClient = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum),
    });
  }
  return null;
};

// Account is a account object from wagmi or viem. get it using useAccount() hook
export const cancelCall = async (callId: string, account: any) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error("Wallet client not available");

  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "cancelCall",
    args: [callId],
    account,
  });

  console.log(tx);
};

export const approve = async (amount: number, account: `0x${string}`) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error("Wallet client not available");

  const amountInWei = amount * 10 ** 6;
  const tx = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: [
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "approve",
    args: [CONTRACT_ADDRESS, BigInt(amountInWei)],
    account,
  });
  console.log(tx);
};

export const deposit = async (amount: number, account: `0x${string}`) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error("Wallet client not available");

  const amountInWei = amount * 10 ** 6;
  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "deposit",
    args: [BigInt(amountInWei)],
    account: account,
  });

  console.log(tx);
};

// Continue this pattern for all other functions that use walletClient
export const endCall = async (
  callId: string,
  rating: number,
  flag: boolean,
  account: any
) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error("Wallet client not available");

  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "endCall",
    args: [callId, rating, flag],
    account,
  });
  console.log(tx);
};

export const expertWithdrawBalance = async (amount: number, account: any) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error("Wallet client not available");

  const amountInWei = amount * 10 ** 6;
  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "expertWithdrawBalance",
    args: [BigInt(amountInWei)],
    account,
  });
  console.log(tx);
};

// Continue this pattern for all remaining functions...
// I'll show one more example and you can apply the same pattern to the rest

export const registerExpert = async (
  name: string,
  expertise: string,
  voiceRatePerMinute: number,
  videoRatePerMinute: number,
  cid: string,
  account: `0x${string}`
) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error("Wallet client not available");

  const voiceRatePerMinuteInWei = voiceRatePerMinute * 10 ** 6;
  const videoRatePerMinuteInWei = videoRatePerMinute * 10 ** 6;

  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "registerExpert",
    args: [
      name,
      expertise,
      BigInt(voiceRatePerMinuteInWei),
      BigInt(videoRatePerMinuteInWei),
      cid,
    ],
    account,
  });
  console.log(tx);
};

// Read operations can stay the same since they use publicClient
export const getCallDetails = async (callId: string) => {
  const call = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getCallDetails",
    args: [callId],
  });
  console.log(call);
};