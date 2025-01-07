export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";

  const prefix = address.slice(0, 2) === "0x" ? "0x" : "";
  const start = prefix.length;

  return `${address.slice(0, chars + start)}...${address.slice(-chars)}`;
}
