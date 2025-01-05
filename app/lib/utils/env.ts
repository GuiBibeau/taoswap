/**
 * Determines if the current environment is a non-production environment
 * (i.e., development, preview, or test environments)
 *
 * @returns {boolean} Returns true if running in a non-production environment,
 *                    false if running in production
 */
export const isLowerEnvironment = (): boolean => {
  return process.env.VERCEL_ENV !== "production";
};
