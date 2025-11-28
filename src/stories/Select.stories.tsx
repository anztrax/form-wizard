import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectOption, SelectProps } from "@/common/components/select";
import React, { useEffect, useState } from "react";

const meta: Meta<typeof Select> = {
  title: "Shared/Select",
  component: Select,
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    showSearch: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

const baseOptions: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Durian (disabled)", value: "durian", disabled: true },
  { label: "Orange", value: "orange" },
];

const COUNTRIES: SelectOption[] = [
  { label: "Indonesia", value: "id" },
  { label: "India", value: "in" },
  { label: "Japan", value: "jp" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "gb" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Australia", value: "au" },
  { label: "Singapore", value: "sg" },
  { label: "Malaysia", value: "my" },
];


export const Basic: Story = {
  args: {
    options: baseOptions,
    placeholder: "Select a fruit",
    showSearch: false,
    size: "md",
    allowClear: true,
  },
  render: (args) => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div style={{ padding: 24, maxWidth: 320 }}>
        <Select
          {...args}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};

export const WithSearch: Story = {
  args: {
    options: baseOptions,
    placeholder: "Search fruit...",
    showSearch: true,
    size: "md",
    allowClear: true,
  },
  render: (args) => {
    const [value, setValue] = React.useState<string | null>("banana");

    return (
      <div style={{ padding: 24, maxWidth: 320 }}>
        <Select
          {...args}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    options: baseOptions,
    value: "apple",
    showSearch: false,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    options: baseOptions,
    placeholder: "Select a fruit",
    showSearch: false,
    hasError: true,
  },
  render: (args) => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div style={{ padding: 24, maxWidth: 320 }}>
        <Select
          {...args}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};

export const LoadingState: Story = {
  args: {
    options: [],
    placeholder: "Loading options...",
    showSearch: true,
    loading: true,
  },
};


const Template = (args: SelectProps) => {
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<SelectOption[]>(COUNTRIES);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (!searchKeyword) {
      setOptions(COUNTRIES);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      const lower = searchKeyword.toLowerCase();
      const filtered = COUNTRIES.filter((country) =>
        country.label.toLowerCase().includes(lower)
      );

      setOptions(filtered);
      setLoading(false);
    }, 100);

    return () => clearTimeout(handler);
  }, [searchKeyword]);

  return (
    <div style={{ maxWidth: 360 }}>
      <Select
        {...args}
        value={value}
        showSearch
        loading={loading}
        options={loading ? [] : options}
        placeholder="Type to search country..."
        onChange={(val, opt) => {
          setValue(val);
          setSelectedOption(opt ?? null);
        }}
        onInputChange={(text: string) => {
          setSearchKeyword(text);
        }}
      />

      <div style={{
        marginTop: 12,
        fontSize: 12,
        color: "#4b5563"
      }}>
        Selected:{" "}
        {selectedOption
          ? `${selectedOption.label} (${selectedOption.value})`
          : "none"}
      </div>
    </div>
  );
};


export const LoadingWithSearch: Story = {
  render: (args) => {
    return <Template {...args} />;
  }
}
