import crypto from "crypto";

// Função para criar um hash criptográfico de um password
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${hash}:${salt}`;
}
