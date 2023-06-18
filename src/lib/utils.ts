export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (typeof value === "undefined") {
    throw new Error(`Environment variable ${key} is required, but not set`);
  }
  return value;
}
