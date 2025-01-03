import { unstable_flag as flag } from "@vercel/flags/next";
import { get } from "@vercel/edge-config";
import { isLowerEnvironment } from "./utils/env";

export const enableTestnet = flag({
  key: "testNet",
  async decide() {
    if (isLowerEnvironment()) {
      return true;
    }

    const edgeConfigFlags = (await get("flags")) as Record<string, boolean>;
    return edgeConfigFlags?.[this.key] ?? false;
  },
});
