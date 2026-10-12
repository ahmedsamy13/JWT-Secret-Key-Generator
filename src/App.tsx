import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Eye,
  EyeOff,
  Github,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  encodeBytes,
  generateBytes,
  minimumBits,
  type Algorithm,
  type Encoding,
} from "./crypto";

const repo = "https://github.com/ahmedsamy13/JWT-Secret-Key-Generator";
const labels: Record<Encoding, string> = {
  hex: "Hex",
  base64: "Base64",
  base64url: "Base64URL",
};

export default function App() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("HS256");
  const [bits, setBits] = useState(256);
  const [encoding, setEncoding] = useState<Encoding>("hex");
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [visible, setVisible] = useState(true);
  const [whole, setWhole] = useState(true);
  const [env, setEnv] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      setBytes(generateBytes(bits));
      setError("");
      setStatus("New secret generated.");
    } catch (e) {
      setBytes(null);
      setError(e instanceof Error ? e.message : "Unable to generate a secret.");
    }
  }, [bits, algorithm]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const key = bytes ? encodeBytes(bytes, encoding) : "";
  const output = env ? `JWT_SECRET=${key}` : key;
  function generate() {
    try {
      setBytes(generateBytes(bits));
      setError("");
      setStatus("New secret generated.");
    } catch (e) {
      setBytes(null);
      setError(e instanceof Error ? e.message : "Unable to generate a secret.");
    }
  }
  function chooseAlgorithm(value: Algorithm) {
    setAlgorithm(value);
    setBits((current) => Math.max(current, minimumBits[value]));
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setStatus("Copied to clipboard.");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus(""), 2500);
    } catch {
      setStatus(
        "Clipboard unavailable. Show the key and select it to copy manually.",
      );
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([output + "\n"], { type: "text/plain" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = env ? "jwt-secret.env" : "jwt-secret.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Secret downloaded. Keep the file private.");
  }

  return (
    <div className="app-shell">
      <header className="header">
        <a className="brand" href="#">
          <span className="brand-icon">
            <KeyRound size={21} />
          </span>
          smsm keysmith<span className="brand-dot">.</span>
        </a>
        <div className="header-right">
          <span className="local-badge">
            <span />
            100% local & private
          </span>
          <a
            className="github-link"
            href={repo}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={18} />
            <span>GitHub</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </header>
      <main>
        <section className="intro">
          <div className="eyebrow">
            <span /> THE LITTLE TOOL FOR YOUR NEXT BIG BUILD
          </div>
          <h1>
            Strong secrets.
            <br />
            <span>Simple generation.</span>
          </h1>
          <p>
            Generate a secure JWT secret in seconds.
            <br className="mobile-break" /> Made in your browser. Kept in your
            hands.
          </p>
          <div className="intro-badges">
            <span>
              <ShieldCheck size={15} />
              Cryptographically random
            </span>
            <span>
              <LockKeyhole size={15} />
              Never sent to a server
            </span>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <KeyRound />
            <span className="hero-spark">✳</span>
          </div>
        </section>
        <section className="workspace" aria-label="JWT secret generator">
          <div className="generator">
            <div className="section-heading">
              <div>
                <span className="step">01</span>
                <h2>Your secret key</h2>
              </div>
              <span className="ready">
                <span />
                {bytes ? "Ready to use" : "Waiting"}
              </span>
            </div>
            <div className="key-box">
              <div className="key-box-top">
                <span>
                  <Code2 size={15} />
                  {env ? ".env" : labels[encoding].toUpperCase()} OUTPUT
                </span>
                <button
                  className="icon-button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? "Hide secret key" : "Show secret key"}
                  title={visible ? "Hide key" : "Show key"}
                >
                  {visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div
                className={`secret ${whole ? "wrap" : "truncate"} ${!visible ? "masked" : ""}`}
                tabIndex={0}
                aria-label={visible ? "Generated secret" : "Secret hidden"}
              >
                {error
                  ? "Generation unavailable"
                  : !bytes
                    ? "Generating your secret…"
                    : visible
                      ? output
                      : "•".repeat(48)}
              </div>
              <div className="key-meta">
                <span>
                  {bits} bits <i /> {bytes?.length ?? 0} bytes <i />{" "}
                  {key.length} characters
                </span>
                <span>
                  <ShieldCheck size={14} />
                  Secure
                </span>
              </div>
            </div>
            <div className="actions">
              <button className="generate-button" onClick={generate}>
                <RefreshCw size={17} />
                Generate new key
                <ArrowRight size={17} />
              </button>
              <button className="copy-button" onClick={copy} disabled={!bytes}>
                {status === "Copied to clipboard." ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}
                {status === "Copied to clipboard." ? "Copied!" : "Copy key"}
              </button>
              <button
                className="download-button"
                onClick={download}
                disabled={!bytes}
                aria-label="Download secret key"
                title="Download secret"
              >
                <ArrowDownToLine size={19} />
              </button>
            </div>
            <div className="feedback" role="status">
              {error || status}
            </div>
            <div className="privacy-note">
              <span className="note-icon">
                <LockKeyhole size={19} />
              </span>
              <div>
                <strong>Your secret stays yours.</strong>
                <p>
                  Keys are generated locally with the Web Crypto API. Nothing is
                  stored or uploaded.
                </p>
              </div>
            </div>
          </div>
          <aside className="settings">
            <div className="section-heading">
              <div>
                <span className="step">02</span>
                <h2>Make it yours</h2>
              </div>
              <SlidersHorizontal size={18} />
            </div>
            <label className="field-label" htmlFor="algorithm">
              Signing algorithm
            </label>
            <div className="select-wrap">
              <select
                id="algorithm"
                value={algorithm}
                onChange={(e) => chooseAlgorithm(e.target.value as Algorithm)}
              >
                <option value="HS256">HS256 — HMAC SHA-256</option>
                <option value="HS384">HS384 — HMAC SHA-384</option>
                <option value="HS512">HS512 — HMAC SHA-512</option>
              </select>
              <ChevronDown size={16} />
            </div>
            <div className="field-row">
              <span className="field-label">Key length</span>
              <span className="tiny-label">
                {minimumBits[algorithm]}-bit minimum
              </span>
            </div>
            <div className="segments bits">
              {[256, 384, 512, 1024].map((value) => (
                <button
                  key={value}
                  disabled={value < minimumBits[algorithm]}
                  aria-pressed={bits === value}
                  onClick={() => setBits(value)}
                  className={bits === value ? "selected" : ""}
                >
                  {value}
                  <span> bits</span>
                </button>
              ))}
            </div>
            <span className="field-label">Output encoding</span>
            <div className="segments">
              {(["hex", "base64", "base64url"] as Encoding[]).map((value) => (
                <button
                  key={value}
                  aria-pressed={encoding === value}
                  onClick={() => {
                    setEncoding(value);
                    setStatus("");
                  }}
                  className={encoding === value ? "selected" : ""}
                >
                  {labels[value]}
                </button>
              ))}
            </div>
            <p className="field-help">
              {encoding === "hex"
                ? "Simple, readable, and easy to use anywhere."
                : encoding === "base64"
                  ? "Compact encoding with standard Base64 padding."
                  : "URL-safe encoding without padding."}
            </p>
            <div className="toggles">
              <Toggle
                label="Show the whole key"
                description="Wrap long keys onto multiple lines"
                checked={whole}
                onChange={() => setWhole(!whole)}
              />
              <Toggle
                label="Format for .env"
                description="Add the JWT_SECRET= prefix"
                checked={env}
                onChange={() => {
                  setEnv(!env);
                  setStatus("");
                }}
              />
            </div>
          </aside>
        </section>
        <section className="guide">
          <div className="guide-title">
            <Sparkles size={19} />
            <h2>A small key. A big responsibility.</h2>
          </div>
          <div className="guide-grid">
            <article>
              <span className="guide-number">01 / GENERATE</span>
              <h3>Start with a strong secret</h3>
              <p>
                Choose your HMAC algorithm and key length. We take care of the
                randomness.
              </p>
            </article>
            <article>
              <span className="guide-number">02 / INTEGRATE</span>
              <h3>Give your app its key</h3>
              <p>
                Copy it into your server’s environment variables. Keep signing
                and verification consistent.
              </p>
            </article>
            <article>
              <span className="guide-number">03 / KEEP SAFE</span>
              <h3>Keep it behind the scenes</h3>
              <p>
                Never commit secrets or put them in frontend code. Use a
                different key for each environment.
              </p>
            </article>
          </div>
          <details>
            <summary>Which encoding should I use?</summary>
            <p>
              Encoding changes how the same random bytes are displayed. If your
              JWT library accepts a string secret, use that exact string for
              both signing and verification. If it expects raw bytes, decode the
              selected encoding first. These are shared secrets for HS256, HS384
              and HS512; RSA and ECDSA use key pairs.
            </p>
            <a
              href="https://www.rfc-editor.org/rfc/rfc7518.html#section-3.2"
              target="_blank"
              rel="noreferrer"
            >
              Read the JWT key requirements <ArrowRight size={13} />
            </a>
          </details>
        </section>
      </main>
      <footer>
        <span className="footer-brand">
          <KeyRound size={15} />
          smsm keysmith.
        </span>
        <span>A little utility for a more secure web.</span>
        <a href={repo} target="_blank" rel="noreferrer">
          Open source <ArrowRight size={14} />
        </a>
      </footer>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="toggle-row">
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="switch" aria-hidden="true" />
    </label>
  );
}
