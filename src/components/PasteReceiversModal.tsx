import { useEffect, useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { TextareaField } from "./Field";
import { useImportReceivers } from "../hooks/useImportReceivers";

interface PasteReceiversModalProps {
  open: boolean;
  onClose: () => void;
}

// Imports receivers from JSON pasted by hand, in the shape the file import accepts.
export const PasteReceiversModal = ({
  open,
  onClose,
}: PasteReceiversModalProps) => {
  const { t } = useTranslation();
  const importReceivers = useImportReceivers();
  const [json, setJson] = useState("");

  useEffect(() => {
    if (open) setJson("");
  }, [open]);

  const handleImport = () => {
    if (importReceivers(json)) onClose();
  };

  return (
    <Modal
      open={open}
      title={t("receiver.paste")}
      description={t("receiver.pasteDescription")}
      icon={<ClipboardPaste className="h-5 w-5" />}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("actions.cancel")}
          </Button>
          <Button type="button" onClick={handleImport} disabled={!json.trim()}>
            {t("receiver.pasteAction")}
          </Button>
        </>
      }
    >
      <TextareaField
        id="receiverJson"
        label={t("receiver.pasteLabel")}
        hint={t("receiver.pasteHint")}
        rows={10}
        spellCheck={false}
        autoComplete="off"
        placeholder={t("receiver.pastePlaceholder")}
        className="font-mono text-xs"
        value={json}
        onChange={(event) => setJson(event.target.value)}
      />
    </Modal>
  );
};

export default PasteReceiversModal;
