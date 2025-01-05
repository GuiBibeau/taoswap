const fs = require("fs");
const { promisify } = require("util");

const readEnvFile = async (filePath) => {
  try {
    const envContent = await fs.promises.readFile(filePath, "utf8");
    return envContent;
  } catch {
    return "";
  }
};

const parseEnvContent = (content) =>
  content.split("\n").reduce((acc, line) => {
    const [key, value] = line.split("=");
    return key && value ? { ...acc, [key.trim()]: value.trim() } : acc;
  }, {});

const mergeEnvData = (existing, newData) => ({
  ...existing,
  ...newData,
});

const formatEnvData = (envObj) =>
  Object.entries(envObj)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

const writeEnvFile = async (filePath, data) => {
  const writeFile = promisify(fs.writeFile);
  await writeFile(filePath, data);
  console.log("Addresses recorded to .env.local");
};

const updateEnvFile = async (newAddresses, envPath = ".env.local") => {
  try {
    const existingContent = await readEnvFile(envPath);
    const existingEnv = parseEnvContent(existingContent);
    const mergedData = mergeEnvData(existingEnv, newAddresses);
    const formattedData = formatEnvData(mergedData);
    await writeEnvFile(envPath, formattedData);
  } catch (error) {
    console.error("Error logging addresses:", error);
    throw error;
  }
};

module.exports = {
  updateEnvFile,
};
