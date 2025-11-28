import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal, ModalProps } from "@/common/components/modal";
import { Button } from "@/common/components/button/Button";

const meta: Meta<typeof Modal> = {
  title: "Shared/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    closeOnOverlayClick: {
      control: { type: "boolean" },
    },
    closeOnEsc: {
      control: { type: "boolean" },
    },
  },
  args: {
    size: "md",
    closeOnOverlayClick: true,
    closeOnEsc: true,
    showCloseIcon: true,
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function BasicModalDemo(args: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => setOpen(true)} variant="primary">
        Open modal
      </Button>

      <Modal
        {...args}
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Basic Modal"
        footer={
          <>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)} variant="primary">
              OK
            </Button>
          </>
        }
      >
        <p>hello there 👋</p>
        <p style={{ marginTop: 8 }}>
          Try press <strong>Esc key</strong> or click overlay to close modal.
        </p>
      </Modal>
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <BasicModalDemo {...args} />,
};

function NestedModalsDemo(args: ModalProps) {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => setIsModal1Open(true)} variant="primary">
        Open modal 1
      </Button>

      <Modal
        {...args}
        isOpen={isModal1Open}
        onClose={() => setIsModal1Open(false)}
        title="Modal 1"
        size="md"
        footer={
          <>
            <Button onClick={() => setIsModal1Open(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => setIsModal2Open(true)} variant="primary">
              Open modal 2
            </Button>
          </>
        }
      >
        <p>
          This is the <strong>Modal 1 </strong> modal. You can open another
          modal on top of it.
        </p>
      </Modal>

      <Modal
        {...args}
        isOpen={isModal2Open}
        onClose={() => setIsModal2Open(false)}
        title="Modal 2"
        size="sm"
        footer={
          <Button onClick={() => setIsModal2Open(false)} variant="primary">
            Close Modal 2
          </Button>
        }
      >
        <p>
          This is the <strong>Modal 2</strong>
        </p>
      </Modal>
    </div>
  );
}

export const NestedModals: Story = {
  render: (args) => <NestedModalsDemo {...args} />,
};
