import { useEffect, useState } from "react";
import { UserRoundPen, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      toast.error(t("toast.receiverNameRequired"));
      return;
    }

    if (!form.address.trim()) {
      toast.error(t("toast.receiverAddressRequired"));
      return;
    }

    if (form.email.trim() && !emailPattern.test(form.email.trim())) {
      toast.error(t("toast.invalidEmail"));
      return;
    }

    const saved = receiver
      ? updateReceiver(receiver.id, form)
      : addReceiver(form);

    toast.success(
      t(isEditing ? "toast.receiverUpdated" : "toast.receiverSaved", {
        name: saved.name,
      })
    );
    onSaved(saved);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEditing ? t("receiver.edit") : t("receiver.add")}
      description={t("receiver.modalDescription")}
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
            {t("actions.cancel")}
          </Button>
          <Button type="button" onClick={handleSave}>
            {isEditing ? t("receiver.saveChanges") : t("receiver.save")}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          id="receiverName"
          name="name"
          label={t("receiver.name")}
          placeholder="Acme Ltd"
          value={form.name}
          onChange={handleChange}
        />

        <TextareaField
          id="receiverAddress"
          name="address"
          label={t("receiver.address")}
          rows={3}
          placeholder={t("receiver.addressPlaceholder")}
          value={form.address}
          onChange={handleChange}
        />

        <TextField
          id="receiverEmail"
          name="email"
          type="email"
          label={t("receiver.email")}
          hint={t("general.optional")}
          placeholder="accounts@company.com"
          value={form.email}
          onChange={handleChange}
        />

        <TextField
          id="receiverGstin"
          name="gstin"
          label={t("receiver.gstin")}
          hint={t("receiver.gstinHint")}
          placeholder="29ABCDE1234F2Z5"
          value={form.gstin}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export default ReceiverModal;
