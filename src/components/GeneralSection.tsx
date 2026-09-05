import { useRef, useState } from "react";
import {
  AtSign,
  BadgeIndianRupee,
  CalendarDays,
  ClipboardPaste,
  Copy,
  Download,
  Hash,
  MapPin,
  Pencil,
  Trash2,
  Upload,
  UserRoundPlus,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useInvoiceStore } from "../store/useInvoiceStore";
import { useReceiverStore } from "../store/useReceiverStore";
import { SelectField, TextField } from "./Field";
import { Menu, MenuItem } from "./Menu";
import { ReceiverModal } from "./ReceiverModal";
import { PasteReceiversModal } from "./PasteReceiversModal";
import ConfirmDialog from "./ConfirmDialog";
import { Receiver } from "../types/receiver";
import { findReceiverByValues, toReceiversFile, toSingleLine } from "../utils/receiver";
import { useImportReceivers } from "../hooks/useImportReceivers";
import { saveAs } from "file-saver";

const iconClasses = "h-4 w-4";

// Builds the unique option list for a receiver field, keeping any value already on the invoice.
const buildOptions = (values: (string | undefined)[], current?: string) => {
  const options = new Set<string>();

  values.forEach((value) => {
    if (value?.trim()) options.add(value);
  });

  if (current?.trim()) options.add(current);

  return Array.from(options);
};

const GeneralSection = () => {
  const { t } = useTranslation();
  const { formData, setFormData } = useInvoiceStore();
  const { receivers, removeReceiver } = useReceiverStore();
  const importReceivers = useImportReceivers();
  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingReceiver, setEditingReceiver] = useState<Receiver | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedReceiver = findReceiverByValues(
    receivers,
    formData.companyAddress,
    formData.email,
    formData.gstin
  );
  const selectedReceiverId = selectedReceiver?.id ?? "";

  const addressOptions = buildOptions(
    receivers.map((receiver) => receiver.address),
    formData.companyAddress
  );
  const emailOptions = buildOptions(
    receivers.map((receiver) => receiver.email),
    formData.email
  );
  const gstinOptions = buildOptions(
    receivers.map((receiver) => receiver.gstin),
    formData.gstin
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  // Fills the receiver fields from a saved entry, or clears them when none is selected.
  const applyReceiver = (receiver?: Receiver) => {
    setFormData({
      companyAddress: receiver?.address ?? "",
      email: receiver?.email ?? "",
      gstin: receiver?.gstin ?? "",
    });
  };

  const handleReceiverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyReceiver(receivers.find((receiver) => receiver.id === e.target.value));
  };

  const openAddReceiver = () => {
    setEditingReceiver(undefined);
    setIsReceiverModalOpen(true);
  };

  const openEditReceiver = () => {
    if (!selectedReceiver) return;
    setEditingReceiver(selectedReceiver);
    setIsReceiverModalOpen(true);
  };

  // Deletes the selected receiver and clears the fields it filled.
  const handleDeleteReceiver = () => {
    if (!selectedReceiver) return;

    removeReceiver(selectedReceiver.id);
    applyReceiver(undefined);
    toast.success(t("toast.receiverDeleted", { name: selectedReceiver.name }));
  };

  // Downloads the saved receivers as a JSON file that the import can read back.
  const handleExport = () => {
    const blob = new Blob([toReceiversFile(receivers)], {
      type: "application/json",
    });
    const today = new Date().toISOString().slice(0, 10);

    saveAs(blob, `receivers-${today}.json`);
    toast.success(t("toast.exported", { count: receivers.length }));
  };

  // Imports receivers from a JSON file and stores them alongside manually added ones.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      importReceivers(await file.text());
    } catch {
      toast.error(t("toast.importFailed"));
    } finally {
      e.target.value = "";
    }
  };

  // Copies the saved receivers as JSON so they can be pasted on another device.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toReceiversFile(receivers));
      toast.success(t("toast.copied", { count: receivers.length }));
    } catch {
      toast.error(t("toast.copyFailed"));
    }
  };

  // Sends the user to the add receiver modal when a field has nothing to choose from yet.
  const emptyFieldGuard = (hasOptions: boolean) =>
    hasOptions
      ? {}
      : {
          onMouseDown: (event: React.MouseEvent<HTMLSelectElement>) => {
            event.preventDefault();
            openAddReceiver();
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLSelectElement>) => {
            if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
              event.preventDefault();
              openAddReceiver();
            }
          },
        };

  const receiverMenuItems: MenuItem[] = [
    {
      label: t("receiver.add"),
      icon: <UserRoundPlus className={iconClasses} />,
      onClick: openAddReceiver,
    },
    {
      label: t("receiver.edit"),
      icon: <Pencil className={iconClasses} />,
      onClick: openEditReceiver,
      disabled: !selectedReceiver,
    },
    {
      label: t("receiver.delete"),
      icon: <Trash2 className={iconClasses} />,
      onClick: () => setIsDeleteConfirmOpen(true),
      disabled: !selectedReceiver,
      tone: "danger",
    },
    {
      label: t("receiver.import"),
      icon: <Upload className={iconClasses} />,
      onClick: () => fileInputRef.current?.click(),
      separated: true,
    },
    {
      label: t("receiver.paste"),
      icon: <ClipboardPaste className={iconClasses} />,
      onClick: () => setIsPasteModalOpen(true),
    },
    {
      label: t("receiver.copy"),
      icon: <Copy className={iconClasses} />,
      onClick: handleCopy,
      disabled: !receivers.length,
    },
    {
      label: t("receiver.export"),
      icon: <Download className={iconClasses} />,
      onClick: handleExport,
      disabled: !receivers.length,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-surface/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <SelectField
            id="savedReceiver"
            label={t("general.savedReceiver")}
            hint={t("general.savedReceiverHint")}
            icon={<Users className={iconClasses} />}
            wrapperClassName="flex-1"
            value={selectedReceiverId}
            onChange={handleReceiverChange}
            {...emptyFieldGuard(receivers.length > 0)}
          >
            <option value="">
              {receivers.length
                ? t("general.selectReceiver")
                : t("general.noReceivers")}
            </option>
            {receivers.map((receiver) => (
              <option key={receiver.id} value={receiver.id}>
                {receiver.name}
              </option>
            ))}
          </SelectField>

          <div className="sm:pb-6">
            <Menu items={receiverMenuItems} label={t("receiver.actions")} />

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="invoiceNumber"
          name="invoiceNumber"
          label={t("general.invoiceNumber")}
          placeholder="INV-001"
          icon={<Hash className={iconClasses} />}
          value={formData.invoiceNumber}
          onChange={handleChange}
        />

        <TextField
          id="invoiceDate"
          name="invoiceDate"
          type="date"
          label={t("general.invoiceDate")}
          icon={<CalendarDays className={iconClasses} />}
          value={formData.invoiceDate}
          onChange={handleChange}
        />

        <SelectField
          id="companyAddress"
          name="companyAddress"
          label={t("general.address")}
          icon={<MapPin className={iconClasses} />}
          wrapperClassName="md:col-span-2"
          value={formData.companyAddress || ""}
          onChange={handleChange}
          {...emptyFieldGuard(addressOptions.length > 0)}
        >
          <option value="">
            {addressOptions.length
              ? t("general.selectAddress")
              : t("general.addReceiverFirst")}
          </option>
          {addressOptions.map((address) => (
            <option key={address} value={address}>
              {toSingleLine(address)}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="email"
          name="email"
          label={t("general.email")}
          hint={t("general.optional")}
          icon={<AtSign className={iconClasses} />}
          value={formData.email || ""}
          onChange={handleChange}
          {...emptyFieldGuard(emailOptions.length > 0)}
        >
          <option value="">
            {emailOptions.length
              ? t("general.notApplicable")
              : t("general.addReceiverFirst")}
          </option>
          {emailOptions.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="gstin"
          name="gstin"
          label={t("general.gstin")}
          hint={t("general.optional")}
          icon={<BadgeIndianRupee className={iconClasses} />}
          value={formData.gstin || ""}
          onChange={handleChange}
          {...emptyFieldGuard(gstinOptions.length > 0)}
        >
          <option value="">
            {gstinOptions.length
              ? t("general.notApplicable")
              : t("general.addReceiverFirst")}
          </option>
          {gstinOptions.map((gstin) => (
            <option key={gstin} value={gstin}>
              {gstin}
            </option>
          ))}
        </SelectField>
      </div>

      <PasteReceiversModal
        open={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
      />

      <ReceiverModal
        open={isReceiverModalOpen}
        receiver={editingReceiver}
        onClose={() => setIsReceiverModalOpen(false)}
        onSaved={applyReceiver}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title={t("receiver.deleteTitle")}
        message={t("receiver.deleteMessage", {
          name: selectedReceiver?.name ?? "",
        })}
        icon={<Trash2 className="h-5 w-5" />}
        confirmLabel={t("receiver.deleteConfirm")}
        onConfirm={handleDeleteReceiver}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default GeneralSection;
