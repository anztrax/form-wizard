import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@/shared/components/select/Select";
import { fn } from "storybook/test";

const meta: Meta<typeof Select> = {
  title: "Shared/Select",
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
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
    onChange: { action: "changed" },
  },
  args: {
    size: "md",
    hasError: false,
    fullWidth: false,
    disabled: false,
    defaultValue: "",
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  <option value="" disabled>
    Select an option...
  </option>,
  <option value="admin">Admin</option>,
  <option value="ops">Ops</option>,
  <option value="hr">HR</option>
];

export const Default: Story = {
  args: {
    children: options,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: options,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: options,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: options,
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    children: options,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: options,
  },
};

export const Prefilled: Story = {
  args: {
    defaultValue: "ops",
    children: options,
  },
};
