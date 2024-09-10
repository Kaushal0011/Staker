require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = "";
const RPC_URL = "https://polygon-amoy.g.alchemy.com/v2/";
module.exports= {
  defaultNetwork: "amoy",
  networks: {
    hardhat: {
      chainId: 80002,
    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

