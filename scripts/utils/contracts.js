const { Contract, ContractFactory, utils, BigNumber } = require("ethers");
const bn = require("bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

// Contract creation helpers
const createContract = (address, abi, provider) =>
  new Contract(address, abi, provider);

const deployContract = async (contractFactory, owner, ...args) => {
  const factory = new ContractFactory(
    contractFactory.abi,
    contractFactory.bytecode,
    owner
  );
  return factory.deploy(...args);
};

// Pool helpers
const fetchPoolMetrics = async (poolContract) => ({
  tickSpacing: await poolContract.tickSpacing(),
  fee: await poolContract.fee(),
  liquidity: (await poolContract.liquidity()).toString(),
});

const fetchSlot0Data = async (poolContract) => {
  const [sqrtPriceX96, tick] = await poolContract.slot0();
  return { sqrtPriceX96, tick };
};

const getPoolData = async (poolContract) => ({
  ...(await fetchPoolMetrics(poolContract)),
  ...(await fetchSlot0Data(poolContract)),
});

// Price calculation
const encodePriceSqrt = (reserve1, reserve0) =>
  BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );

// Token helpers
const approveToken = async (tokenContract, signer, spenderAddress, amount) => {
  await tokenContract.connect(signer).approve(spenderAddress, amount);
};

module.exports = {
  createContract,
  deployContract,
  fetchPoolMetrics,
  fetchSlot0Data,
  getPoolData,
  encodePriceSqrt,
  approveToken,
};
