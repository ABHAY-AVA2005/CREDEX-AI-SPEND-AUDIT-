import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

/**
 * lib/vault.ts
 * CFO-Grade Encryption Vault for Fluxora.
 * Uses AES-256-GCM to ensure user API keys are never stored in plaintext.
 */

const ALGORITHM = "aes-256-gcm";
const SECRET = process.env.VAULT_SECRET || "default-fluxora-vault-secret-2026";
const KEY = scryptSync(SECRET, "salt", 32);

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  // Store IV and AuthTag along with the encrypted text
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedData.split(":");
  
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
