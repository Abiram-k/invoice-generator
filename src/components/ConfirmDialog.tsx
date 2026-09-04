import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  icon?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

// Asks the user to confirm a destructive action before it runs.
export const ConfirmDialog = ({
  open,
  title,
  message,
  icon,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      title={title}
      description={message}
      icon={icon}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelLabel ?? t("actions.cancel")}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
};

export default ConfirmDialog;
