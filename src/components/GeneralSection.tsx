import { useRef, useState } from "react";
import {
  AtSign,
  BadgeIndianRupee,
  CalendarDays,
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

import { useInvoiceStore } from "../store/useInvoiceStore";
import { useReceiverStore } from "../store/useReceiverStore";
import { SelectField, TextField } from "./Field";
import { Menu, MenuItem } from "./Menu";
import { ReceiverModal } from "./ReceiverModal";
import ConfirmDialog from "./ConfirmDialog";
import { Receiver } from "../types/receiver";
import { findReceiverByValues, toReceiversFile, toSingleLine } from "../utils/receiver";
import { parseReceiversJson } from "../utils/parseReceiversJson";
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
  const { formData, setFormData } = useInvoiceStore();
  const { receivers, addReceivers, removeReceiver } = useReceiverStore();
  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);
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
    toast.success(`${selectedReceiver.name} deleted.`);
  };

  // Downloads the saved receivers as a JSON file that the import can read back.
  const handleExport = () => {
    const blob = new Blob([toReceiversFile(receivers)], {
      type: "application/json",
    });
    const today = new Date().toISOString().slice(0, 10);

    saveAs(blob, `receivers-${today}.json`);
    toast.success(`${receivers.length} receiver${receivers.length === 1 ? "" : "s"} exported.`);
  };

  // Imports receivers from a JSON file and stores them alongside manually added ones.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = parseReceiversJson(await file.text());
      const count = addReceivers(imported);
      toast.success(`${count} receiver${count === 1 ? "" : "s"} imported.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not read that file."
      );
    } finally {
      e.target.value = "";
    }
  };

  const receiverMenuItems: MenuItem[] = [
    {
      label: "Add receiver",
      icon: <UserRoundPlus className={iconClasses} />,
      onClick: openAddReceiver,
    },
    {
      label: "Edit receiver",
      icon: <Pencil className={iconClasses} />,
      onClick: openEditReceiver,
      disabled: !selectedReceiver,
    },
    {
      label: "Delete receiver",
      icon: <Trash2 className={iconClasses} />,
      onClick: () => setIsDeleteConfirmOpen(true),
      disabled: !selectedReceiver,
      tone: "danger",
    },
    {
      label: "Import from JSON",
      icon: <Upload className={iconClasses} />,
      onClick: () => fileInputRef.current?.click(),
      separated: true,
    },
    {
      label: "Export to JSON",
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
            label="Saved receiver"
            hint="Fills the address, email and GSTIN below."
            icon={<Users className={iconClasses} />}
            wrapperClassName="flex-1"
            value={selectedReceiverId}
            onChange={handleReceiverChange}
          >
            <option value="">
              {receivers.length ? "Select a receiver" : "No receivers saved yet"}
            </option>
            {receivers.map((receiver) => (
              <option key={receiver.id} value={receiver.id}>
                {receiver.name}
              </option>
            ))}
          </SelectField>

          <div className="sm:pb-6">
            <Menu items={receiverMenuItems} label="Receiver actions" />

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
          label="Invoice Serial Number"
          placeholder="INV-001"
          icon={<Hash className={iconClasses} />}
          value={formData.invoiceNumber}
          onChange={handleChange}
        />

        <TextField
          id="invoiceDate"
          name="invoiceDate"
          type="date"
          label="Invoice Date"
          icon={<CalendarDays className={iconClasses} />}
          value={formData.invoiceDate}
          onChange={handleChange}
        />

        <SelectField
          id="companyAddress"
          name="companyAddress"
          label="Receiver Company Address"
          icon={<MapPin className={iconClasses} />}
          wrapperClassName="md:col-span-2"
          value={formData.companyAddress || ""}
          onChange={handleChange}
        >
          <option value="">Select an address</option>
          {addressOptions.map((address) => (
            <option key={address} value={address}>
              {toSingleLine(address)}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="email"
          name="email"
          label="Email (To)"
          hint="Optional"
          icon={<AtSign className={iconClasses} />}
          value={formData.email || ""}
          onChange={handleChange}
        >
          <option value="">Not applicable</option>
          {emailOptions.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="gstin"
          name="gstin"
          label="GSTIN"
          hint="Optional"
          icon={<BadgeIndianRupee className={iconClasses} />}
          value={formData.gstin || ""}
          onChange={handleChange}
        >
          <option value="">Not applicable</option>
          {gstinOptions.map((gstin) => (
            <option key={gstin} value={gstin}>
              {gstin}
            </option>
          ))}
        </SelectField>
      </div>

      <ReceiverModal
        open={isReceiverModalOpen}
        receiver={editingReceiver}
        onClose={() => setIsReceiverModalOpen(false)}
        onSaved={applyReceiver}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title="Delete this receiver?"
        message={`${selectedReceiver?.name ?? "This receiver"} will be removed from this device, and the receiver fields on this invoice will be cleared.`}
        icon={<Trash2 className="h-5 w-5" />}
        confirmLabel="Delete receiver"
        onConfirm={handleDeleteReceiver}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default GeneralSection;
