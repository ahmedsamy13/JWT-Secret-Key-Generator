# SMSM Keysmith — JWT Secret Key Generator

A clean, responsive, single-page React app built with TypeScript, Tailwind CSS v4 and Vite.

## Run locally

```sh
npm install
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## Features

- Cryptographically random keys generated locally with Web Crypto's `getRandomValues`.
- HS256, HS384 and HS512 presets with enforced 256, 384 and 512-bit minimums.
- 256, 384, 512 and 1024-bit lengths.
- Hex, Base64 and Base64URL output; switching encoding preserves the same random bytes.
- Full-key wrapping, reveal/hide controls, clipboard copy, download and `.env` formatting.
- Responsive layout and keyboard-accessible controls.
- No analytics, external fonts, secret persistence or server requests.

Changing the algorithm or bit length generates a fresh key. Other display settings preserve it. Copy and download always use the full key, even when hidden or truncated. Clipboard access requires HTTPS or localhost and browser permission.

These keys are shared HMAC secrets, not RSA or ECDSA key pairs. Bit counts describe the generated random bytes, not the length of the encoded text. If your JWT library accepts a string, use the identical encoded string for signing and verification. If it expects bytes, decode the chosen encoding first. Keep secrets in server-side environment variables or a secret manager. Never put them in frontend bundles or commit downloaded secret files.

## Research

- [RFC 7518, section 3.2](https://www.rfc-editor.org/rfc/rfc7518.html#section-3.2): HMAC keys must be at least as long as their hash output.
- [MDN: Crypto.getRandomValues](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues): cryptographically strong randomness in the browser.

## Deploy

`npm run build` produces `dist/`, which can be served by any static host. No backend or runtime environment variables are needed. Use HTTPS for clipboard functionality. Vite uses the domain root by default; set `base` in `vite.config.ts` if deploying under a subdirectory.
