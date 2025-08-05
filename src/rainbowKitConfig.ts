"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, mainnet, zksync } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Token-Gated Demo',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, anvil, zksync],
  ssr: false,
});

export default config;