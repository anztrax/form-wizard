import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { Button } from '@/common/components/button/Button';

const meta = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: {
        type: 'boolean'
      }
    },
    onClick: { action: 'clicked' },
  },
  args: {
    onClick: fn(),
    children: 'Button',
    size: 'md',
    variant: 'primary',
    fullWidth: false,
    disabled: false
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary button',
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline button',
    variant: "outline",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger button",
    variant: "danger",
  },
};

export const Small: Story = {
  args: {
    children: "Small button",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large button",
    size: "lg",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full width button",
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const Playground: Story = {
  args: {
    children: "Play with controls",
  },
};
