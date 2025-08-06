"use client";

import { useTheme } from "next-themes";
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Abi } from "abitype";
import BasicNftJson from "@/abis/contracts/BasicNft.sol/BasicNft.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function MintPage() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const { address, isConnected } = useAccount();
  const [supply, setSupply] = useState<{ total: bigint; max: bigint }>({
    total: 0n,
    max: 0n,
  });
  const [price, setPrice] = useState<bigint>(0n);

  const contractAddress = process.env
    .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS! as `0x${string}`;
  const BasicNftAbi = BasicNftJson.abi as unknown as Abi;

  // Read contract data in a single batch
  const { data: contractData, isLoading: loadingData } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: BasicNftAbi,
        functionName: "totalSupply",
      },
      {
        address: contractAddress,
        abi: BasicNftAbi,
        functionName: "getMaxSupply",
      },
      {
        address: contractAddress,
        abi: BasicNftAbi,
        functionName: "getMintPrice",
      },
    ],
  });

  useEffect(() => {
    if (contractData) {
      console.log("Contract Data => 53", contractData);
      const [total, max, mintPrice] = contractData;
      if (total.status === "success" && max.status === "success") {
        console.log("MAX SUPPLY", max.result);
        console.log("TOTAL SUPPLY", total.result);
        setSupply({ total: total.result as bigint, max: max.result as bigint });
      }
      if (mintPrice.status === "success") {
        setPrice(mintPrice.result as bigint);
      }
    }
  }, [contractData]);

  const soldOut = supply.total >= supply.max;

  // Mint function
  const {
    data: hash,
    writeContract: mint,
    isPending: minting,
    error: mintError,
  } = useWriteContract();

  const { isLoading: pending, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = () => {
    console.log("Minting NFT price...", ethers.formatEther(price));
    mint({
      address: contractAddress,
      abi: BasicNftAbi,
      functionName: "mint",
      value: price,
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-500">
      <div className="flex justify-end p-4">
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-black/60 dark:bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl mt-6 text-white dark:text-black">
          <h1 className="text-4xl font-bold text-center mb-4">
            🚀 Mint Your NFT {supply.max.toString()}
          </h1>

          {loadingData ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <p className="text-center">
                Minted: <strong>{supply.total.toString()}</strong> /{" "}
                <strong>{supply.max.toString()}</strong>
              </p>
              <p className="text-center mb-4">
                Price: <strong>{ethers.formatEther(price)} ETH</strong>
              </p>
            </>
          )}

          {!isConnected ? (
            <p className="text-center text-lg">
              🔒 Connect your wallet to mint.
            </p>
          ) : soldOut ? (
            <p className="text-center text-red-500 text-lg">❌ Sold Out!</p>
          ) : pending ? (
            <button
              disabled
              className="w-full py-3 bg-gray-600 rounded-lg font-semibold"
            >
              Minting…
            </button>
          ) : isSuccess ? (
            <button
              disabled
              className="w-full py-3 bg-green-600 rounded-lg font-semibold"
            >
              Minted!
            </button>
          ) : mintError ? (
            <button
              disabled
              className="w-full py-3 bg-red-600 rounded-lg font-semibold"
            >
              Error Minting
            </button>
          ) : (
            <button
              onClick={handleMint}
              disabled={minting || soldOut}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
            >
              {minting ? "Minting…" : "Mint NFT"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
