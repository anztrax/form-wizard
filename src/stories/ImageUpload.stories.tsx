import type { Meta, StoryObj } from "@storybook/react";
import { ImageUpload } from "@/common/components/imageUpload/ImageUpload";
import { useState } from "react";
import { Button } from "@/common/components/button/Button";
import { InputText } from "@/common/components/inputText/InputText";

const meta: Meta<typeof ImageUpload> = {
  title: "Components/ImageUpload",
  component: ImageUpload,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {
  render: function Render(args) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    return (
      <div style={{ maxWidth: "600px" }}>
        <ImageUpload
          {...args}
          value={file}
          onChange={(newFile) => {
            setFile(newFile);
            setError("");
          }}
          onError={setError}
        />
        {file && (
          <div style={{ marginTop: "16px", fontSize: "14px" }}>
            <strong>Selected file:</strong>
            <div>Name: {file.name}</div>
            <div>Size: {(file.size / 1024).toFixed(2)} KB</div>
            <div>Type: {file.type}</div>
          </div>
        )}
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: function Render(args) {
    const [file, setFile] = useState<File | null>(null);

    return (
      <div style={{ maxWidth: "600px" }}>
        <ImageUpload
          {...args}
          helperText="Upload a profile picture (PNG, JPG, or GIF)"
          value={file}
          onChange={setFile}
        />
      </div>
    );
  },
};

export const Required: Story = {
  render: function Render(args) {
    const [file, setFile] = useState<File | null>(null);

    return (
      <div style={{ maxWidth: "600px" }}>
        <ImageUpload
          {...args}
          helperText="Required field - please upload a product image"
          value={file}
          onChange={setFile}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: function Render(args) {
    const [file, setFile] = useState<File | null>(null);

    return (
      <div style={{ maxWidth: "600px" }}>
        <ImageUpload
          {...args}
          value={file}
          onChange={setFile}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    return (
      <div style={{ maxWidth: "600px" }}>
        <ImageUpload
          {...args}
          helperText="This upload field is disabled"
          disabled
        />
      </div>
    );
  },
};


export const InForm: Story = {
  render: function Render(args) {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      avatar: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form data:", formData);
    };

    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Name
          </label>
          <InputText
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Email
          </label>
          <InputText
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <ImageUpload
            {...args}
            value={formData.avatar}
            onChange={(file) => setFormData({ ...formData, avatar: file })}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
        >
          Submit Form
        </Button>
      </form>
    );
  },
};
