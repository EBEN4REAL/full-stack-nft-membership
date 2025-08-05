import { ethers } from "ethers";
import abi from "@/abis/BasicNft.json";
import deployed from "../deployed.json";

export function useBasicNftContract(provider: ethers.Provider) {
  return new ethers.Contract(deployed.BasicNft, abi, provider);
}
