"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi"; // Import useDisconnect

export const ConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-gradient-to-r from-[#FBB03B] to-[#FBB4D5] text-white px-3 py-1 rounded-md text-sm font-nunito"
                    style={{
                      background: "linear-gradient(90deg, #FBB03B, #FBB4D5)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#FFF",
                      padding: "8px 16px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Connect <span>🔗</span>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    style={{
                      background: "linear-gradient(90deg, #FBB03B, #FBB4D5)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#FFF",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={openChainModal}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "linear-gradient(90deg, #FBB03B, #FBB4D5)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#FFF",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {/* {chain.iconUrl && (
                          // <Image
                          //   alt={chain.name ?? "Chain icon"}
                          //   src={chain.iconUrl}
                          //   style={{ width: 10, height: 10 }}
                          // />
                        )} */}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    style={{
                      background: "linear-gradient(90deg, #FBB03B, #FBB4D5)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#FFF",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}{" "}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export const useDisconnectWallet = () => {
  const { disconnect } = useDisconnect();
  return disconnect;
};
