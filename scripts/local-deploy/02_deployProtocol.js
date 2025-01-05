const { ContractFactory, utils } = require("ethers");
const { updateEnvFile } = require("../utils/env");
const { deployContract, saveContractInfo } = require("../utils/contracts");
const WTAO = require("../../artifacts/contracts/WTAO.sol/WTAO.json");
const { saveProtocolInfo } = require("../utils/saveProtocolInfo");

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const linkLibraries = ({ bytecode, linkReferences }, libraries) => {
  return Object.keys(linkReferences).reduce((acc, fileName) => {
    return Object.keys(linkReferences[fileName]).reduce(
      (innerAcc, contractName) => {
        if (!libraries.hasOwnProperty(contractName)) {
          throw new Error(`Missing link library name ${contractName}`);
        }

        const address = utils
          .getAddress(libraries[contractName])
          .toLowerCase()
          .slice(2);

        return linkReferences[fileName][contractName].reduce(
          (finalAcc, { start, length }) => {
            const start2 = 2 + start * 2;
            const length2 = length * 2;
            return finalAcc
              .slice(0, start2)
              .concat(address)
              .concat(finalAcc.slice(start2 + length2, finalAcc.length));
          },
          innerAcc
        );
      },
      acc
    );
  }, bytecode);
};

async function main() {
  const [owner] = await ethers.getSigners();
  const networkName = (await ethers.provider.getNetwork()).name || "local";

  const wtaoAddress = process.env.WTAO_ADDRESS;
  if (!wtaoAddress) {
    throw new Error("WTAO_ADDRESS not found in environment variables");
  }
  console.log("Using WTAO from environment:", wtaoAddress);

  const factory = await deployContract(artifacts.UniswapV3Factory, owner);
  await saveContractInfo("UniswapV3Factory", factory, networkName);

  const swapRouter = await deployContract(
    artifacts.SwapRouter,
    owner,
    factory.address,
    wtaoAddress
  );
  await saveContractInfo("SwapRouter", swapRouter, networkName);

  const nftDescriptor = await deployContract(artifacts.NFTDescriptor, owner);
  await saveContractInfo("NFTDescriptor", nftDescriptor, networkName);

  const linkedBytecode = linkLibraries(
    {
      bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
      linkReferences: {
        "NFTDescriptor.sol": {
          NFTDescriptor: [{ length: 20, start: 1681 }],
        },
      },
    },
    { NFTDescriptor: nftDescriptor.address }
  );

  const nativeCurrencyLabelBytes = utils.formatBytes32String("WTAO");
  const nonfungibleTokenPositionDescriptor = await new ContractFactory(
    artifacts.NonfungibleTokenPositionDescriptor.abi,
    linkedBytecode,
    owner
  ).deploy(wtaoAddress, nativeCurrencyLabelBytes);
  await saveContractInfo(
    "NonfungibleTokenPositionDescriptor",
    nonfungibleTokenPositionDescriptor,
    networkName
  );

  const nonfungiblePositionManager = await deployContract(
    artifacts.NonfungiblePositionManager,
    owner,
    factory.address,
    wtaoAddress,
    nonfungibleTokenPositionDescriptor.address
  );
  await saveContractInfo(
    "NonfungiblePositionManager",
    nonfungiblePositionManager,
    networkName
  );

  const addresses = {
    FACTORY_ADDRESS: factory.address,
    SWAP_ROUTER_ADDRESS: swapRouter.address,
    NFT_DESCRIPTOR_ADDRESS: nftDescriptor.address,
    POSITION_DESCRIPTOR_ADDRESS: nonfungibleTokenPositionDescriptor.address,
    POSITION_MANAGER_ADDRESS: nonfungiblePositionManager.address,
  };

  await updateEnvFile(addresses);
  await Promise.all([
    Object.entries(addresses).forEach(([name, address]) => {
      const contractName = name.replace("_ADDRESS", "");
      const contractArtifact = artifacts[contractName] || WTAO;
      saveContractInfo(
        contractName,
        {
          address,
          abi: contractArtifact.abi,
          provider: ethers.provider,
        },
        networkName
      );
    }),
  ]);

  const networkId = (await ethers.provider.getNetwork()).chainId;

  await saveProtocolInfo(networkId, addresses);
}

/*
npx hardhat run --network localhost scripts/local-deploy/02_deployProtocol.js
npx hardhat run --network bittensorTestnet scripts/local-deploy/02_deployProtocol.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
