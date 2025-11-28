import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectOption, SelectProps } from "@/common/components/select";
import React, { useEffect, useState, useMemo, useRef } from "react";

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

function BasicSelectDemo(args: SelectProps) {
  const [value, setValue] = React.useState<string | null>(null);

  return (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <Select {...args} value={value} onChange={(val) => setValue(val)} />
    </div>
  );
}

export const Basic: Story = {
  args: {
    options: baseOptions,
    placeholder: "Select a fruit",
    showSearch: false,
    size: "md",
    allowClear: true,
  },
  render: (args) => <BasicSelectDemo {...args} />,
};

function WithSearchDemo(args: SelectProps) {
  const [value, setValue] = React.useState<string | null>("banana");

  return (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <Select {...args} value={value} onChange={(val) => setValue(val)} />
    </div>
  );
}

export const WithSearch: Story = {
  args: {
    options: baseOptions,
    placeholder: "Search fruit...",
    showSearch: true,
    size: "md",
    allowClear: true,
  },
  render: (args) => <WithSearchDemo {...args} />,
};

export const Disabled: Story = {
  args: {
    options: baseOptions,
    value: "apple",
    showSearch: false,
    disabled: true,
  },
};

function WithErrorDemo(args: SelectProps) {
  const [value, setValue] = React.useState<string | null>(null);

  return (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <Select {...args} value={value} onChange={(val) => setValue(val)} />
    </div>
  );
}

export const WithError: Story = {
  args: {
    options: baseOptions,
    placeholder: "Select a fruit",
    showSearch: false,
    hasError: true,
  },
  render: (args) => <WithErrorDemo {...args} />,
};

export const LoadingState: Story = {
  args: {
    options: [],
    placeholder: "Loading options...",
    showSearch: true,
    loading: true,
  },
};


function LoadingWithSearchDemo(args: SelectProps) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchKeyword) return COUNTRIES;
    const lower = searchKeyword.toLowerCase();
    return COUNTRIES.filter((country) =>
      country.label.toLowerCase().includes(lower)
    );
  }, [searchKeyword]);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!searchKeyword) {
      setLoading(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchKeyword]);

  return (
    <div style={{ maxWidth: 360 }}>
      <Select
        {...args}
        value={value}
        showSearch
        loading={loading}
        options={loading ? [] : filteredOptions}
        placeholder="Type to search country..."
        onChange={(val, opt) => {
          setValue(val);
          setSelectedOption(opt ?? null);
        }}
        onInputChange={(text: string) => {
          setSearchKeyword(text);
        }}
      />

      <div
        style={{
          marginTop: 12,
          fontSize: 12,
          color: "#4b5563",
        }}
      >
        Selected:{" "}
        {selectedOption
          ? `${selectedOption.label} (${selectedOption.value})`
          : "none"}
      </div>
    </div>
  );
}

export const LoadingWithSearch: Story = {
  render: (args) => <LoadingWithSearchDemo {...args} />,
};
