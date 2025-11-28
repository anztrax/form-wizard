"use client";

import { Modal } from "@/common/components/modal/";
import styles from "./ImagePreviewModal.module.css";

export type ImagePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  employeeName?: string;
};

export function ImagePreviewModal(props: ImagePreviewModalProps) {
  const { isOpen, onClose, imageUrl, employeeName } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeName ? `${employeeName}'s Photo` : "Employee Photo"}
      size="lg"
    >
      <div className={styles["image-preview-modal"]}>
        <div className={styles["image-preview-modal__container"]}>
          <img
            src={imageUrl}
            alt={employeeName || "Employee"}
            className={styles["image-preview-modal__image"]}
          />
        </div>
      </div>
    </Modal>
  );
}
