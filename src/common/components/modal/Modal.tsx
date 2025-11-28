import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";
import classNames from "classnames";
import { useModalLayer } from "./useModalLayer";

export type ModalSize = "sm" | "md" | "lg";

export type ModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;

  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;

  size?: ModalSize;
  showCloseIcon?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;

  className?: string;
}

export function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    showCloseIcon = true,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    className = "",
  } = props;

  const { overlayZIndex, dialogZIndex } = useModalLayer();
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (!isOpen || !closeOnEsc) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, closeOnEsc]);

  if (!isOpen) {
    return null;
  }

  const baseClass = "modal";
  const dialogClassName = classNames(
    styles[`${baseClass}__dialog`],
    styles[`${baseClass}__dialog--size-${size}`],
    className,
  );

  const modalContent = (
    <div className={styles[`${baseClass}`]}>
      <div
        className={styles[`${baseClass}__overlay`]}
        style={{ zIndex: overlayZIndex }}
        onClick={() => {
          if (closeOnOverlayClick) {
            onClose();
          }
        }}
      />

      <div
        className={styles[`${baseClass}__container`]}
        style={{ zIndex: dialogZIndex }}
        aria-modal="true"
        role="dialog"
      >
        <div className={dialogClassName}>
          {title && (
            <div className={styles[`${baseClass}__header`]}>
              <div className={styles[`${baseClass}__title`]}>{title}</div>
              {showCloseIcon && (
                <button
                  type="button"
                  className={styles[`${baseClass}__close`]}
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className={styles[`${baseClass}__body`]}>
            {children}
          </div>

          {footer && (
            <div className={styles[`${baseClass}__footer`]}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isBrowser && typeof document !== "undefined") {
    return ReactDOM.createPortal(modalContent, document.body);
  }

  return modalContent;
};
