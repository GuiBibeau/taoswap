require("dotenv").config({
  path: ".env.local",
});

const { execSync } = require("child_process");

const runScript = (scriptPath) => {
  console.log(`\n🚀 Running ${scriptPath}...\n`);
  try {
    execSync(`npx hardhat run --network localhost ${scriptPath}`, {
      stdio: "inherit",
    });
    console.log(`\n✅ ${scriptPath} completed successfully\n`);
  } catch (error) {
    console.error(`\n❌ Error running ${scriptPath}:`);
    throw error;
  }
};

const main = async () => {
  const deploymentSteps = [
    "scripts/01_deployContracts.js",
    "scripts/02_deployTokens.js",
    "scripts/03_deployPools.js",
    "scripts/04_addLiquidity.js",
    "scripts/05_checkLiquidity.js",
  ];

  console.log("🎬 Starting deployment sequence...\n");

  for (const script of deploymentSteps) {
    await runScript(script);
  }

  console.log("\n🎉 All deployments completed successfully!");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
