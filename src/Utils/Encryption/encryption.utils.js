import crypto from "crypto";
import fs from "fs";
import { format } from "path";

const ENCRYPTION_SECERT_KEY = Buffer.from("12345678901234567890123456789012");
const IV_LENGTH = +process.env.IV_LENGTH;

export const encrypt = (plainText) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECERT_KEY,
    iv
  );

  let encrypted = cipher.update(plainText, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = (encryptedData) => {
  const [ivHex, cipherText] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECERT_KEY,
    iv
  );
  let decrypted = decipher.update(cipherText, "hex", "utf-8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

if (fs.existsSync("public_key.pem") && fs.existsSync("private_key.pem")) {
  console.log("Keys Already Exists !");
} else {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  fs.writeFileSync("public_Key.pem", publicKey);
  fs.writeFileSync("private_Key.pem", privateKey);
}

export const asymmetricencrypt = (plainText) => {
  const bufferText = Buffer.from(plainText, "utf8");
  const encryptedData = crypto.publicEncrypt(
    {
      key: fs.readFileSync("public_Key.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    bufferText
  );
  return encryptedData.toString("hex");
};

export const asymmetricdecrypt = (cipherText) => {
  const bufferText = Buffer.from(cipherText, "hex");
  const decryptedData = crypto.privateDecrypt(
    {
      key: fs.readFileSync("private_Key.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    bufferText
  );
  return decryptedData.toString("utf8");
};
