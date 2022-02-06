require("@nomiclabs/hardhat-waffle");
const projectId = 'project id';
const fs = require('fs')
const keyData = fs.readFileSync('./p-key.txt', {
  encoding:'utf8', flag:'r'
})

module.exports = {
  defaultNetwork: 'mumbai',
  networks:{
    hardhat:{
      chainId: 1337
    },
    mumbai:{
      url:`https://rpc-mumbai.maticvigil.com`,
      accounts:[keyData]
    },
    mainnet: {
      url:`https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts:[keyData]
    }
  },
  solidity: {
  version: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
};
