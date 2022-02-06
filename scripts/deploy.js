
const hre = require("hardhat");
const fs = require('fs')

async function main() {
  const AgroMarket = await hre.ethers.getContractFactory("MandiHouse");
  const agroMarket = await AgroMarket.deploy();
  await agroMarket.deployed();
  console.log("agroMarket contract deployed to: ", agroMarket.address);

  const NFT = await hre.ethers.getContractFactory("AgroNFT");
  const nft = await NFT.deploy(agroMarket.address);
  await nft.deployed();
  console.log("NFT contract deployed to: ", nft.address);

  let config = `
  export const nftmarketaddress = ${agroMarket.address}
  export const nftaddress = ${nft.address}`

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
