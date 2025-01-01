const { ContractFactory, utils } = require("ethers");
const WETH9 = require("../contracts/WETH9.json");
const { updateEnvFile } = require("./utils/env");
const { deployContract } = require("./utils/contracts");

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  WETH9,
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

  const weth = await deployContract(artifacts.WETH9, owner);
  const factory = await deployContract(artifacts.UniswapV3Factory, owner);
  const swapRouter = await deployContract(
    artifacts.SwapRouter,
    owner,
    factory.address,
    weth.address
  );
  const nftDescriptor = await deployContract(artifacts.NFTDescriptor, owner);

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

  const nativeCurrencyLabelBytes = utils.formatBytes32String("WETH");
  const nonfungibleTokenPositionDescriptor = await new ContractFactory(
    artifacts.NonfungibleTokenPositionDescriptor.abi,
    linkedBytecode,
    owner
  ).deploy(weth.address, nativeCurrencyLabelBytes);

  const nonfungiblePositionManager = await deployContract(
    artifacts.NonfungiblePositionManager,
    owner,
    factory.address,
    weth.address,
    nonfungibleTokenPositionDescriptor.address
  );

  const addresses = {
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
