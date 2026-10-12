import test from "node:test";
import assert from "node:assert/strict";
import { encodeBytes, generateBytes, minimumBits } from "../src/crypto.ts";

test("generates the requested number of random bytes", () => {
  for (const bits of [256, 384, 512, 1024, 2048]) {
    const bytes = generateBytes(bits);
    assert.equal(bytes.length, bits / 8);
    assert.notDeepEqual(bytes, generateBytes(bits));
  }
});
test("rejects invalid bit lengths", () => {
  for (const bits of [0, 128, 257, 256.5, 2056, NaN, Infinity])
    assert.throws(() => generateBytes(bits));
});
test("encodes known bytes correctly in each format", () => {
  const bytes = new Uint8Array([0, 255, 254, 253]);
  assert.equal(encodeBytes(bytes, "hex"), "00fffefd");
  assert.equal(encodeBytes(bytes, "base64"), "AP/+/Q==");
  assert.equal(encodeBytes(bytes, "base64url"), "AP_-_Q");
});
test("encodings preserve the original random bytes", () => {
  for (const bits of [256, 384, 512, 1024]) {
    const bytes = generateBytes(bits);
    for (const encoding of ["hex", "base64", "base64url"] as const) {
      const decoded = Buffer.from(encodeBytes(bytes, encoding), encoding);
      assert.deepEqual(new Uint8Array(decoded), bytes);
    }
  }
});
test("minimum lengths match the HMAC hash output sizes", () => {
  assert.deepEqual(minimumBits, { HS256: 256, HS384: 384, HS512: 512 });
});
