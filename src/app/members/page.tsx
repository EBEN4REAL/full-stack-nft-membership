"use client";
import { useAccount, useContractRead } from "wagmi";
import type { Abi } from "abitype";
import basicNftJson from "@/abis/contracts/BasicNft.sol/BasicNft.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function MembersPage() {
  const { address, isConnected } = useAccount();
  const [isMember, setIsMember] = useState<boolean | null>(null);
  
  const contractAddress = process.env
    .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS! as `0x${string}`;
  const BasicNftAbi = basicNftJson as unknown as Abi;

  const { data: balance, isFetching } = useContractRead({
    address: contractAddress,
    abi: BasicNftAbi,
    functionName: "balanceOf",
    args: [address ?? ethers.ZeroAddress],
    query: { enabled: isConnected },
  });

  useEffect(() => {
    if (typeof balance === "bigint") {
      setIsMember(balance > 0n);
    }
  }, [balance]);

  return (
    <div className="">
      <div className="w-full max-w-lg  backdrop-blur-md p-8 rounded-3xl shadow-2xl text-white space-y-8">
        <h1 className="text-3xl font-bold text-center">Members Area</h1>

        {!isConnected ? (
          <p className="text-center text-lg">
            🔒 Please connect your wallet to view this page.
          </p>
        ) : isFetching ? (
          <p className="animate-pulse text-center text-lg">
            Checking your NFT balance…
          </p>
        ) : isMember === false ? (
          <p className="text-center text-red-400 text-lg">
            ❌ You don’t hold the required NFT.
          </p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-center">
              🎉 Welcome, Member!
            </h2>
            <p className="text-center text-lg">
              This is your exclusive, token-gated content. Feel free to
              customize as you wish!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
