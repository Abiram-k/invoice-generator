import { useEffect, useState } from "react";
import { UserRoundPen, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { TextField, TextareaField } from "./Field";
import { useReceiverStore } from "../store/useReceiverStore";
import { Receiver } from "../types/receiver";

interface ReceiverModalProps {
  open: boolean;
  receiver?: Receiver;
  onClose: () => void;
  onSaved: (receiver: Receiver) => void;
}

const emptyForm = { name: "", address: "", email: "", gstin: "" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Collects a new receiver and stores it for reuse across invoices.
export const ReceiverModal = ({
  open,
  receiver,
  onClose,
  onSaved,
}: ReceiverModalProps) => {
  const { addReceiver, updateReceiver } = useReceiverStore();
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(receiver);

  useEffect(() => {
    if (!open) return;

    setForm(
      receiver
        ? {
            name: receiver.name,
            address: receiver.address,
            email: receiver.email ?? "",
            gstin: receiver.gstin ?? "",
          }
        : emptyForm
    );
  }, [open, receiver]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: name === "gstin" ? value.toUpperCase() : value,
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Receiver name is required.");
      return;
    }

    if (!form.address.trim()) {
      toast.error("Receiver address is required.");
      return;
    }

    if (form.email.trim() && !emailPattern.test(form.email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }

    const saved = receiver
      ? updateReceiver(receiver.id, form)
      : addReceiver(form);

    toast.success(`${saved.name} ${isEditing ? "updated" : "saved"}.`);
    onSaved(saved);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Edit receiver" : "Add receiver"}
      description="Saved receivers stay on this device and can be reused on any invoice."
      icon={
        isEditing ? (
          <UserRoundPen className="h-5 w-5" />
        ) : (
          <UserRoundPlus className="h-5 w-5" />
        )
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {isEditing ? "Save changes" : "Save receiver"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          id="receiverName"
          name="name"
          label="Receiver name"
          placeholder="Acme Ltd"
          value={form.name}
          onChange={handleChange}
        />

        <TextareaField
          id="receiverAddress"
          name="address"
          label="Address"
          rows={3}
          placeholder="Street, city, state, postal code"
          value={form.address}
          onChange={handleChange}
        />

        <TextField
          id="receiverEmail"
          name="email"
          type="email"
          label="Email"
          hint="Optional"
          placeholder="accounts@company.com"
          value={form.email}
          onChange={handleChange}
        />

        <TextField
          id="receiverGstin"
          name="gstin"
          label="GSTIN"
          hint="Optional. Saved in uppercase."
          placeholder="29ABCDE1234F2Z5"
          value={form.gstin}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export default ReceiverModal;
