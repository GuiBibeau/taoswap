require("dotenv").config({
  path: ".env.local",
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    },
  },
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: process.env.OWNER_PRIVATE_KEY,
          balance: "10000000000000000000000",
        },
        {
          privateKey: process.env.USER_PRIVATE_KEY,
          balance: "10000000000000000000000",
        },
      ],
    },
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.OWNER_PRIVATE_KEY, process.env.USER_PRIVATE_KEY],
    },
  },
};
