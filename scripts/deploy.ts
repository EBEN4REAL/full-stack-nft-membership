import hre from "hardhat";

async function main() {
  const { ethers }   = hre;                // pull ethers off the Hardhat Runtime Env
  const Factory      = await ethers.getContractFactory("BasicNft");

  const baseUri      = "ipfs://QmYourBaseCid/";  // your metadata folder
  const maxSupply    = 1000;                     // cap of your collection
  const mintPrice    = ethers.parseEther("0.0001"); // 0.01 ETH per mint

  // Deploy, passing constructor args in order
  const nft = await Factory.deploy(baseUri, maxSupply, mintPrice);

  // waitForDeployment() on Hardhat/Ethers v6
  await nft.waitForDeployment();

  console.log("▶️ BasicNft deployed to:", await nft.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
