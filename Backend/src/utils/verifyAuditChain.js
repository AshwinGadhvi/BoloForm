import { generateHash } from "./hashUtil.js";

export const verifyAuditChain = (logs) => {
  for (let i = 1; i < logs.length; i++) {
    const expectedHash = generateHash(
      logs[i].documentHash +
      logs[i - 1].currentHash +
      logs[i].action
    );

    if (expectedHash !== logs[i].currentHash) {
      return false;
    }
  }
  return true;
};
