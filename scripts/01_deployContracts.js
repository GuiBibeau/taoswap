const { ContractFactory, utils } = require("ethers");
const WETH9 = require("../contracts/WETH9.json");

const fs = require("fs");
const { promisify } = require("util");
const { updateEnvFile } = require("./utils/env");

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  WETH9,
};

const linkLibraries = ({ bytecode, linkReferences }, libraries) => {
  Object.keys(linkReferences).forEach((fileName) => {
    Object.keys(linkReferences[fileName]).forEach((contractName) => {
      if (!libraries.hasOwnProperty(contractName)) {
        throw new Error(`Missing link library name ${contractName}`);
      }
      const address = utils
        .getAddress(libraries[contractName])
        .toLowerCase()
        .slice(2);
      linkReferences[fileName][contractName].forEach(({ start, length }) => {
        const start2 = 2 + start * 2;
        const length2 = length * 2;
        bytecode = bytecode
          .slice(0, start2)
          .concat(address)
          .concat(bytecode.slice(start2 + length2, bytecode.length));
      });
    });
  });
  return bytecode;
};

async function main() {
  const [owner] = await ethers.getSigners();

  Weth = new ContractFactory(
    artifacts.WETH9.abi,
    artifacts.WETH9.bytecode,
    owner
  );
  weth = await Weth.deploy();

  Factory = new ContractFactory(
    artifacts.UniswapV3Factory.abi,
    artifacts.UniswapV3Factory.bytecode,
    owner
  );
  factory = await Factory.deploy();

  SwapRouter = new ContractFactory(
    artifacts.SwapRouter.abi,
    artifacts.SwapRouter.bytecode,
    owner
  );
  swapRouter = await SwapRouter.deploy(factory.address, weth.address);

  NFTDescriptor = new ContractFactory(
    artifacts.NFTDescriptor.abi,
    artifacts.NFTDescriptor.bytecode,
    owner
  );
  nftDescriptor = await NFTDescriptor.deploy();

  const linkedBytecode = linkLibraries(
    {
      bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
      linkReferences: {
        "NFTDescriptor.sol": {
          NFTDescriptor: [
            {
              length: 20,
              start: 1681,
            },
          ],
        },
      },
    },
    {
      NFTDescriptor: nftDescriptor.address,
    }
  );

  NonfungibleTokenPositionDescriptor = new ContractFactory(
    artifacts.NonfungibleTokenPositionDescriptor.abi,
    linkedBytecode,
    owner
  );

  const nativeCurrencyLabelBytes = utils.formatBytes32String("WETH");
  nonfungibleTokenPositionDescriptor =
    await NonfungibleTokenPositionDescriptor.deploy(
      weth.address,
      nativeCurrencyLabelBytes
    );

  NonfungiblePositionManager = new ContractFactory(
    artifacts.NonfungiblePositionManager.abi,
    artifacts.NonfungiblePositionManager.bytecode,
    owner
  );
  nonfungiblePositionManager = await NonfungiblePositionManager.deploy(
    factory.address,
    weth.address,
    nonfungibleTokenPositionDescriptor.address
  );

  let addresses = {
    WETH_ADDRESS: weth.address,
    FACTORY_ADDRESS: factory.address,
    SWAP_ROUTER_ADDRESS: swapRouter.address,
    NFT_DESCRIPTOR_ADDRESS: nftDescriptor.address,
    POSITION_DESCRIPTOR_ADDRESS: nonfungibleTokenPositionDescriptor.address,
    POSITION_MANAGER_ADDRESS: nonfungiblePositionManager.address,
  };

  return updateEnvFile(addresses);
}

/*
npx hardhat run --network localhost scripts/01_deployContracts.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
