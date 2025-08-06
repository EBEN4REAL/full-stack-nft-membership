import { BasicNft, BasicNft__factory } from "@/typechain-types";
import { expect } from "chai";
// import { ethers } from "hardhat";
import { Signer } from "ethers";

import hardhat from "hardhat";
const { ethers } = hardhat;

describe("BasicNft", function () {
  let nft: BasicNft;
  let deployer: Signer;
  const BASE_URI = "ipfs://QmRsfjCUK4BRbWDA25NMeqUwW87avDWPZ2xZgvt9ZTb3AY";
  const MAX_SUPPLY = 3;
  const PRICE = ethers.parseEther("0.0001"); // returns a bigint

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    const factory = (await ethers.getContractFactory(
      "BasicNft",
      deployer
    )) as BasicNft__factory;
    nft = await factory.deploy(BASE_URI, MAX_SUPPLY, PRICE);
  });

  it("should start with zero supply", async () => {
    expect(await nft.totalSupply()).to.equal(0n);
  });

  it("should mint when sent exact price", async () => {
    await expect(nft.connect(deployer).mint({ value: PRICE }))
      .to.emit(nft, "Transfer")
      .withArgs(ethers.ZeroAddress, await deployer.getAddress(), 0n);

    expect(await nft.totalSupply()).to.equal(1n);
    expect(await nft.ownerOf(0)).to.equal(await deployer.getAddress());
    expect(await nft.tokenURI(0)).to.equal(BASE_URI + "0.json");
  });

  it("should revert on wrong price", async () => {
    await expect(
      nft.connect(deployer).mint({ value: PRICE - 1n })
    ).to.be.revertedWith("WrongPrice"); // or use .to.be.revertedWithCustomError(nft, "WrongPrice")
  });

  it("should revert when sold out", async () => {
    for (let i = 0; i < MAX_SUPPLY; i++) {
      await nft.connect(deployer).mint({ value: PRICE });
    }

    await expect(
      nft.connect(deployer).mint({ value: PRICE })
    ).to.be.revertedWith("SoldOut"); // or use .to.be.revertedWithCustomError(nft, "SoldOut")
  });

  it("exposes maxSupply & mintPrice getters", async () => {
    // You must have public getters or define these explicitly in your contract
    expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
    expect(await nft.mintPrice()).to.equal(PRICE);
  });
});
