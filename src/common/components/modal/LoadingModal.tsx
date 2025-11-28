"use client";

import { Modal } from "./Modal";
import { LoaderCircle } from "lucide-react";
import styles from "./loadingModal.module.css";

export type LoadingModalProps = {
  isOpen: boolean;
  message?: string;
};

export function LoadingModal(props: LoadingModalProps) {
  const { isOpen, message = "Loading..." } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      showCloseIcon={false}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="sm"
      className={styles["loading-modal"]}
    >
      <div className={styles["loading-modal__content"]}>
        <LoaderCircle className={styles["loading-modal__spinner"]} size={48} />
        <p className={styles["loading-modal__message"]}>{message}</p>
      </div>
    </Modal>
  );
}
