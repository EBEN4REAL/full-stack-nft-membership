
import { getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, sepolia, zksync, anvil } from "wagmi/chains";

export const chains = [mainnet, polygon, zksync, sepolia, anvil] as const;

export const wagmiConfig = getDefaultConfig({
  appName: "Token gated demo",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, 
  chains,
  ssr: false,
});

// Create a dark theme with your brand colors:
export const rkTheme = darkTheme({
  accentColor:        '#7D3C98',   // your primary brand accent
  accentColorForeground: '#fff',   // text/icon on accent backgrounds
  borderRadius:       'small',     // none / small / medium / large / full
  fontStack:          'system',    // system / rounded / mono
  overlayBlur:        'small',     // none / small / medium / large
});