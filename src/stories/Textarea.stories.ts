import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { Textarea } from '@/common/components/textarea/Textarea';

const meta = {
  title: 'Shared/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
    onChange: { action: "changed" },
  },
  args: {
    placeholder: "Textarea",
    size: "md",
    hasError: false,
    fullWidth: false,
    disabled: false,
    rows: 4,
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "sm",
    placeholder: "small textarea",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    placeholder: "large textarea",
    rows: 6,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: "full width textarea",
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    placeholder: "this textarea has error",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "disabled textarea",
  },
};

export const PrefilledText: Story = {
  args: {
    defaultValue: "hello world...",
  },
};
