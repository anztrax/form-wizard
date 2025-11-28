import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectOption } from "./index";
import { useState, useEffect } from "react";

const baseOptions: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

const COUNTRIES: SelectOption[] = [
  { label: "Indonesia", value: "id" },
  { label: "India", value: "in" },
  { label: "Japan", value: "jp" },
];

function SelectWrapper({ onSearch }: { onSearch?: (keyword: string) => void }) {
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<SelectOption[]>(COUNTRIES);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (!searchKeyword) {
      setOptions(COUNTRIES);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      const filtered = COUNTRIES.filter((item) =>
        item.label.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setOptions(filtered);
      setLoading(false);
      onSearch?.(searchKeyword);
    }, 50);

    return () => clearTimeout(handler);
  }, [searchKeyword, onSearch]);

  return (
    <Select
      value={value}
      showSearch
      loading={loading}
      options={loading ? [] : options}
      placeholder="Search country..."
      onChange={(val) => setValue(val)}
      onInputChange={setSearchKeyword}
    />
  );
}

describe("Select", () => {
  it("renders with placeholder", () => {
    render(
      <Select
        options={baseOptions}
        placeholder="Select a fruit"
        value={null} onChange={() => { }}
      />
    );
    expect(screen.getByText("Select a fruit"))
      .toBeInTheDocument();
  });

  it("shows options when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Select
        options={baseOptions}
        placeholder="Select"
        value={null}
        onChange={() => { }}
      />
    );

    await user.click(screen.getByText("Select"));

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("calls onChange when option selected", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Select
        options={baseOptions}
        placeholder="Select"
        value={null}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByText("Select"));
    await user.click(screen.getByText("Banana"));

    expect(handleChange)
      .toHaveBeenCalledWith(
        "banana",
        { label: "Banana", value: "banana" }
      );
  });

  it("filters options with search", async () => {
    const user = userEvent.setup();
    render(
      <Select
        options={baseOptions}
        placeholder="Search..."
        showSearch value={null}
        onChange={() => { }}
      />
    );

    const input = screen.getByPlaceholderText("Search...");
    await user.click(input);
    await user.clear(input);
    await user.type(input, "ban");

    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  it("renders and fetches suggestions correctly (async)", async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(
      <SelectWrapper
        onSearch={handleSearch}
      />
    );

    const input = screen.getByPlaceholderText("Search country...");
    await user.click(input);

    expect(screen.getByText("Indonesia")).toBeInTheDocument();
    expect(screen.getByText("Japan")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "ind");

    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith("ind");
    });

    await waitFor(() => {
      expect(screen.getByText("Indonesia")).toBeInTheDocument();
      expect(screen.getByText("India")).toBeInTheDocument();
      expect(screen.queryByText("Japan")).not.toBeInTheDocument();
    });
  });

  it("clears selection when clear button clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Select
        options={baseOptions}
        value="apple"
        onChange={handleChange}
        allowClear
      />
    );

    await user.click(screen.getByLabelText("Clear selection"));
    expect(handleChange)
      .toHaveBeenCalledWith(null, null);
  });
});
