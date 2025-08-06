/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const { ethers } = hre;
  const Factory    = await ethers.getContractFactory('BasicNft');

  const baseUri   = 'ipfs://QmRsfjCUK4BRbWDA25NMeqUwW87avDWPZ2xZgvt9ZTb3AY';
  const maxSupply = 1000;
  const mintPrice = ethers.parseEther('0.0001');

  const nft = await Factory.deploy(baseUri, maxSupply, mintPrice);
  await nft.waitForDeployment();
  console.log('▶️ BasicNft deployed to:', await nft.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
