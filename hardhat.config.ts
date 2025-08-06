import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/ethers-v6";
import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-ignition";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
    ganache: {
      url: process.env.GANACHE_RPC_URL || "HTTP://127.0.0.1:7545",
      chainId: 1337,
      accounts: {
        mnemonic: "quit know fire inform explain uniform page icon wrist vibrant salon other",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
  },
  paths: {
    artifacts: "./src/abis",
  },
  typechain: {
    outDir: "./src/typechain-types",
    target: "ethers-v6",
  },
};

export default config;