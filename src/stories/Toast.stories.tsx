import type { Meta, StoryObj } from "@storybook/react";
import {
  ToastProvider,
  useToast,
} from "@/shared/components/toast/Toast";
import { Button } from "@/shared/components/button/Button";

const meta: Meta = {
  title: "Shared/Toast",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const ToastDemo = () => {
  const { showToast } = useToast();

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ marginBottom: 12 }}>
        Toast
      </h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button
          onClick={() =>
            showToast({ type: "info", message: "This is an info toast" })
          }
          variant="primary"
        >
          info
        </Button>

        <Button
          onClick={() =>
            showToast({
              type: "success",
              message: "Action completed successfully",
            })
          }
          variant="primary"
        >
          success
        </Button>

        <Button
          onClick={() =>
            showToast({
              type: "warning",
              message: "Be careful with this operation",
            })
          }
          variant="primary"
        >
          warning
        </Button>

        <Button
          onClick={() =>
            showToast({
              type: "error",
              message: "Something went wrong",
            })
          }
          variant="primary"
        >
          error
        </Button>
      </div>

      <p style={{ marginTop: 16, fontSize: 13, color: "#4b5563" }}>
        Toasts appear at the top of the page and disappear automatically
        after 3 seconds (default). <br/>
        You can also dismiss them with the close icon.
      </p>
    </div>
  );
};

const ToastDemoWithProvider = () => (
  <ToastProvider>
    <ToastDemo />
  </ToastProvider>
);

export const Default: Story = {
  render: () => <ToastDemoWithProvider />,
};
