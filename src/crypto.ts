export type Encoding = "hex" | "base64" | "base64url";
export type Algorithm = "HS256" | "HS384" | "HS512";
export const minimumBits: Record<Algorithm, number> = {
  HS256: 256,
  HS384: 384,
  HS512: 512,
};

export function generateBytes(bits: number): Uint8Array {
  if (!Number.isInteger(bits) || bits < 256 || bits > 2048 || bits % 8 !== 0) {
    throw new Error(
      "Choose a key length from 256 to 2048 bits, in multiples of 8.",
    );
  }
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error(
      "Your browser does not support secure random generation. Please use a modern browser.",
    );
  }
  return globalThis.crypto.getRandomValues(new Uint8Array(bits / 8));
}

export function encodeBytes(bytes: Uint8Array, encoding: Encoding): string {
  if (encoding === "hex")
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  const base64 = btoa(String.fromCharCode(...bytes));
  return encoding === "base64"
    ? base64
    : base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
