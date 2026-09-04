import { ReceiverInput } from "../types/receiver";
import { normalizeReceiver } from "./receiver";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (source: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
};

// Reads an uploaded receivers file, accepting either an array or a { receivers: [] } wrapper.
// Errors carry a translation key so the caller can show a localised message.
export const parseReceiversJson = (raw: string): ReceiverInput[] => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("invalidJson");
  }

  const list = Array.isArray(parsed)
    ? parsed
    : isRecord(parsed) && Array.isArray(parsed.receivers)
      ? parsed.receivers
      : null;

  if (!list) {
    throw new Error("expectedArray");
  }

  const receivers = list
    .filter(isRecord)
    .map((entry) =>
      normalizeReceiver({
        name: readString(entry, ["name", "companyName", "company"]),
        address: readString(entry, ["address", "companyAddress"]),
        email: readString(entry, ["email"]),
        gstin: readString(entry, ["gstin", "gst", "gstNumber"]),
      })
    )
    .filter((receiver) => receiver.name && receiver.address);

  if (!receivers.length) {
    throw new Error("noReceiverFound");
  }

  return receivers;
};
