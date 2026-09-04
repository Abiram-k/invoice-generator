export interface Receiver {
  id: string;
  name: string;
  address: string;
  email?: string;
  gstin?: string;
}

export type ReceiverInput = Omit<Receiver, "id">;
