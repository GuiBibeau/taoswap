const fs = require("fs");
const path = require("path");

async function saveProtocolInfo(networkId, contracts) {
  // Only save for specified networks
  if (networkId !== 945 && networkId !== 964) {
    return;
  }

  const networkType = networkId === 945 ? "testnet" : "mainnet";
  const outputDir = path.join(__dirname, "../../protocol-info");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const protocolInfo = {
    networkId,
    networkType,
    contracts: {
      factory: contracts.FACTORY_ADDRESS,
      swapRouter: contracts.SWAP_ROUTER_ADDRESS,
      nftDescriptor: contracts.NFT_DESCRIPTOR_ADDRESS,
      positionDescriptor: contracts.POSITION_DESCRIPTOR_ADDRESS,
      positionManager: contracts.POSITION_MANAGER_ADDRESS,
    },
    tokens: {
      WTAO: process.env.WTAO_ADDRESS,
      USDC: process.env.USDC_ADDRESS,
    },
    deploymentTimestamp: Math.floor(Date.now() / 1000),
  };

  const filePath = path.join(outputDir, `${networkType}-protocol.json`);
  fs.writeFileSync(filePath, JSON.stringify(protocolInfo, null, 2));
  console.log(`Protocol information saved to ${filePath}`);
}

module.exports = {
  saveProtocolInfo,
};
