const fs = require("fs");
const { promisify } = require("util");

async function updateEnvFile(newAddresses) {
  // Read existing .env.local file or create empty object if it doesn't exist
  let existingEnv = {};
  try {
    const envContent = await fs.promises.readFile(".env.local", "utf8");
    existingEnv = envContent.split("\n").reduce((acc, line) => {
      const [key, value] = line.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});
  } catch (error) {
    // File doesn't exist or can't be read, continue with empty object
  }

  // Merge new addresses with existing env vars
  const mergedEnv = { ...existingEnv, ...newAddresses };

  // Convert back to string format
  const data = Object.entries(mergedEnv)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const writeFile = promisify(fs.writeFile);
  const filePath = ".env.local";
  return writeFile(filePath, data)
    .then(() => {
      console.log("Addresses recorded to .env.local");
    })
    .catch((error) => {
      console.error("Error logging addresses:", error);
      throw error;
    });
}

module.exports = {
  updateEnvFile,
};
