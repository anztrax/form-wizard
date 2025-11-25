import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InputText } from "@/shared/components/inputText/InputText";
import { fn } from 'storybook/test';

const meta = {
  title: "Shared/InputText",
  component: InputText,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    hasError: {
      control: { type: "boolean" },
    },
    fullWidth: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number"],
    },
    onChange: { action: "changed" },
  },
  args: {
    size: 'md',
    placeholder: "Input text...",
    hasError: false,
    fullWidth: false,
    disabled: false,
    type: "text",
    onChange: fn()
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
    placeholder: "Small input",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    placeholder: "Medium input",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    placeholder: "Large input",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: "Full width input",
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    placeholder: "Input with error style",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const EmailType: Story = {
  args: {
    type: "email",
    placeholder: "name@example.com",
  },
};
