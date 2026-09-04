import { Receiver, ReceiverInput } from "../types/receiver";

// Trims the receiver fields and normalises GSTIN to uppercase before storing.
export const normalizeReceiver = (receiver: ReceiverInput): ReceiverInput => ({
  name: receiver.name?.trim() ?? "",
  address: receiver.address?.trim() ?? "",
  email: receiver.email?.trim() || undefined,
  gstin: receiver.gstin?.trim().toUpperCase() || undefined,
});

export const createReceiverId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `receiver-${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Collapses a multi line address so it stays readable inside a select option.
export const toSingleLine = (value: string): string =>
  value.replace(/\s*\n\s*/g, ", ").trim();

export const findReceiverByValues = (
  receivers: Receiver[],
  address?: string,
  email?: string,
  gstin?: string
): Receiver | undefined =>
  receivers.find(
    (receiver) =>
      receiver.address === address &&
      (receiver.email ?? "") === (email ?? "") &&
      (receiver.gstin ?? "") === (gstin ?? "")
  );

// Serialises saved receivers in the same shape the import accepts.
export const toReceiversFile = (receivers: Receiver[]): string =>
  JSON.stringify(
    receivers.map(({ name, address, email, gstin }) => ({
      name,
      address,
      ...(email ? { email } : {}),
      ...(gstin ? { gstin } : {}),
    })),
    null,
    2
  );
