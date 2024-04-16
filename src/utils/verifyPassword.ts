import crypto from "crypto";

// Função para verificar se um dado corresponde ao hash gerado anteriormente
export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const [hash, salt] = hashedPassword.split(":");
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === verifyHash;
}
