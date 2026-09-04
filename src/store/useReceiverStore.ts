import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Receiver, ReceiverInput } from "../types/receiver";
import { createReceiverId, normalizeReceiver } from "../utils/receiver";

type ReceiverStore = {
  receivers: Receiver[];
  addReceiver: (receiver: ReceiverInput) => Receiver;
  addReceivers: (receivers: ReceiverInput[]) => number;
  updateReceiver: (id: string, receiver: ReceiverInput) => Receiver;
  removeReceiver: (id: string) => void;
};

const withId = (receiver: ReceiverInput): Receiver => ({
  ...normalizeReceiver(receiver),
  id: createReceiverId(),
});

export const useReceiverStore = create<ReceiverStore>()(
  persist(
    (set) => ({
      receivers: [],

      addReceiver: (receiver) => {
        const saved = withId(receiver);
        set((state) => ({ receivers: [...state.receivers, saved] }));
        return saved;
      },

      addReceivers: (receivers) => {
        const saved = receivers.map(withId);
        set((state) => ({ receivers: [...state.receivers, ...saved] }));
        return saved.length;
      },

      updateReceiver: (id, receiver) => {
        const updated = { ...normalizeReceiver(receiver), id };
        set((state) => ({
          receivers: state.receivers.map((existing) =>
            existing.id === id ? updated : existing
          ),
        }));
        return updated;
      },

      removeReceiver: (id) =>
        set((state) => ({
          receivers: state.receivers.filter((receiver) => receiver.id !== id),
        })),
    }),
    {
      name: "invoice-receivers",
    }
  )
);
