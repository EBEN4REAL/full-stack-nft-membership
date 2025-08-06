// src/app/mint/page.tsx
'use client';

import { useTheme } from 'next-themes';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import type { Abi } from 'abitype';
import BasicNftJson from '@/abis/contracts/BasicNft.sol/BasicNft.json';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function MintPage() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { address, isConnected } = useAccount();
  const [supply, setSupply] = useState<{ total: bigint; max: bigint }>({ total: 0n, max: 0n });
  const [price, setPrice] = useState<bigint>(0n);

  const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS! as `0x${string}`;
  const BasicNftAbi = BasicNftJson as unknown as Abi;

  // Read totalSupply and maxSupply
  const { data: total } = useContractRead<bigint>({
    address: contractAddress,
    abi: BasicNftAbi,
    functionName: 'totalSupply',
    query: { enabled: true },
  });
  const { data: max } = useContractRead<bigint>({
    address: contractAddress,
    abi: BasicNftAbi,
    functionName: 'getMaxSupply',
    query: { enabled: true },
  });
  const { data: mintPrice } = useContractRead<bigint>({
    address: contractAddress,
    abi: BasicNftAbi,
    functionName: 'getMintPrice',
    query: { enabled: true },
  });

  useEffect(() => {
    if (typeof total === 'bigint' && typeof max === 'bigint') {
      setSupply({ total, max });
    }
    if (typeof mintPrice === 'bigint') {
      setPrice(mintPrice);
    }
  }, [total, max, mintPrice]);

  // Prepare mint
  const { write: mint, isLoading: minting, data: tx } = useContractWrite({
    address: contractAddress,
    abi: BasicNftAbi,
    functionName: 'mint',
    overrides: { value: price },
    mode: 'recklesslyUnprepared',
  });
  const { isLoading: pending, isSuccess } = useWaitForTransaction({ hash: tx?.hash });

  const soldOut = supply.total >= supply.max;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-100 dark:via-gray-50 dark:to-white transition-colors duration-500">
      <div className="flex justify-end p-4">
        <button
          onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black"
          aria-label="Toggle Dark Mode"
        >
          {currentTheme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <ConnectButton showBalance={false} chainStatus="full" accountStatus="avatar" />
        <div className="w-full max-w-md bg-black/60 dark:bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl mt-6 text-white dark:text-black">
          <h1 className="text-4xl font-bold text-center mb-4">🚀 Mint Your NFT</h1>
          <p className="text-center">Minted: <strong>{supply.total.toString()}</strong> / <strong>{supply.max.toString()}</strong></p>
          <p className="text-center mb-4">Price: <strong>{ethers.formatEther(price)} ETH</strong></p>

          {!isConnected ? (
            <p className="text-center text-lg">🔒 Connect your wallet to mint.</p>
          ) : soldOut ? (
            <p className="text-center text-red-500 text-lg">❌ Sold Out!</p>
          ) : pending ? (
            <button disabled className="w-full py-3 bg-gray-600 rounded-lg font-semibold">Minting…</button>
          ) : isSuccess ? (
            <button disabled className="w-full py-3 bg-green-600 rounded-lg font-semibold">Minted!</button>
          ) : (
            <button
              onClick={() => mint?.()}
              disabled={minting}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
            >
              {minting ? 'Minting…' : 'Mint NFT'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
