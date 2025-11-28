export function formatBytesToMB(bytes: number, decimals = 2): string {
  if (typeof bytes !== "number" || Number.isNaN(bytes) || bytes <= 0) {
    return "0.00";
  }

  const mb = bytes / (1024 * 1024);
  return mb.toFixed(decimals);
}
