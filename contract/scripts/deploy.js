const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftcontract = await NFTMarketplace.deploy();

  await nftcontract.deployed();
  const data = {
    address: nftcontract.address,
    abi: JSON.parse(nftcontract.interface.format('json'))
  }

  fs.writeFileSync(__dirname + '/../../src/contract/ABI.json', JSON.stringify(data))
  console.log("NFT Marketplace deployed to:", nftcontract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
