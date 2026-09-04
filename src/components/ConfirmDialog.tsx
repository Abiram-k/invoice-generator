import { ReactNode } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  icon?: ReactNode;
  confirmLabel?: string;
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
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <Modal
    open={open}
    title={title}
    description={message}
    icon={icon}
    onClose={onClose}
    footer={
      <>
        <Button type="button" variant="secondary" onClick={onClose}>
          {cancelLabel}
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

export default ConfirmDialog;
