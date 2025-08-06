import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "nft-metadata");

// Replace with your actual image CIDs
const IMAGE_CIDS = [
  "QmcKdYSWC3mEyrhNP5wwsmUYaNC1zBfowXmhxA6hYVMDXu",
  "QmTnddA3CreNZwHkaeXiCgULuckZsqMPG9fYXWB7Gq5EPM", 
  "QmbrfTqsDFJPZcnbwj29aLL29RA3cLwQmVEYPwHUskD8To" 
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

for (let i = 0; i < IMAGE_CIDS.length; i++) {
  const timestamp = Math.floor(Date.now() / 1000);
  const metadata = {
    name: `Gold Membership NFT #${i}`,
    description: "Exclusive membership access for premium users of the platform.",
    image: `ipfs://${IMAGE_CIDS[i]}`,
    attributes: [
      { trait_type: "Membership Level", value: "Gold" },
      { trait_type: "Access Tier", value: "All Access" },
      { trait_type: "Benefits", value: "Unlimited Features" },
      { trait_type: "Edition", value: i + 1 },
      { display_type: "date", trait_type: "Issued On", value: timestamp }
    ]
  };

  const filepath = path.join(OUTPUT_DIR, `${i}.json`);
  fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));
  console.log(`✅ Metadata for NFT #${i} written to ${filepath}`);
}
