const fs = require("fs");
const path = require("path");

async function getBytecode(address) {
  const bytecode = await ethers.provider.getCode(address);
  return bytecode;
}

async function saveToFile(address, bytecode) {
  const outputDir = path.join(__dirname, "../../bytecode");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `${address}.bytecode`;
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, bytecode);
  console.log(`Bytecode saved to ${filePath}`);
}

async function main() {
  const targetAddress = "0xef71f3bab4136e87ec34d47f83f310a1998d0e13";

  if (!targetAddress) {
    throw new Error("Please provide TARGET_ADDRESS in environment variables");
  }

  console.log(`Fetching bytecode for address: ${targetAddress}`);

  try {
    const bytecode = await getBytecode(targetAddress);

    if (bytecode === "0x") {
      throw new Error(
        "No bytecode found at this address (it may not be a contract)"
      );
    }

    await saveToFile(targetAddress, bytecode);
    console.log("Bytecode length:", (bytecode.length - 2) / 2, "bytes");
  } catch (error) {
    console.error("Error fetching bytecode:", error);
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  getBytecode,
};
