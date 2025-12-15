import AuditLog from "../models/AuditLog.js";
import { generateHash } from "./hashUtil.js";

export const logAudit = async ({
  pdfId,
  action,
  actor,
  ip,
  userAgent,
  payload,
}) => {
  const lastLog = await AuditLog.findOne({ pdfId })
    .sort({ createdAt: -1 });

  const previousHash = lastLog?.currentHash || null;

  const documentHash = generateHash(JSON.stringify(payload));

  const currentHash = generateHash(
    documentHash + previousHash + action
  );

  await AuditLog.create({
    pdfId,
    action,
    actor,
    ipAddress: ip,
    userAgent,
    documentHash,
    previousHash,
    currentHash,
  });
};
