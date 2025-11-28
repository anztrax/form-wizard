import { SelectOption } from "./types";

export const getValuesFromOptions = (options: SelectOption[]): Array<SelectOption['value']> => {
  return options.map((opt) => opt.value);
}

export const getSelectedOption = (params: {
  value: SelectOption['value']
  options: SelectOption[],
}) => {
  const {
    value,
    options
  } = params;
  return options.find((opt) => opt.value === value) ?? null;
};

export const getFilteredOptions = (params: {
  options: SelectOption[],
  searchTerm: string,
  showSearch: boolean,
}) => {
  const {
    options,
    searchTerm,
    showSearch
  } = params;

  if (!showSearch || !searchTerm.trim()) {
    return options;
  }

  const loweredSearchTerm = searchTerm.toLowerCase();
  return options.filter((opt) => opt.label.toLowerCase().includes(loweredSearchTerm));
}

export const isOptionDisabled = (filteredOptions: SelectOption[], index: number) => {
  return !filteredOptions[index] || filteredOptions[index]?.disabled;
};

export const isValidHighlightedIndex = (
  filteredOptions: SelectOption[],
  highlightedIndex: number
): boolean => {
  return (
    highlightedIndex >= 0 &&
    highlightedIndex < filteredOptions.length &&
    Boolean(filteredOptions[highlightedIndex]) &&
    !filteredOptions[highlightedIndex]?.disabled
  );
};
export const findNextValidIndex = (
  filteredOptions: SelectOption[],
  currentIndex: number,
  direction: 'up' | 'down'
): number => {
  let nextIndex = currentIndex;

  if (direction === 'down') {
    nextIndex = currentIndex + 1;
    while (nextIndex < filteredOptions.length && isOptionDisabled(filteredOptions, nextIndex)) {
      nextIndex++;
    }
    return nextIndex < filteredOptions.length ? nextIndex : currentIndex;
  }

  if (direction === 'up') {
    nextIndex = currentIndex - 1;
    while (nextIndex >= 0 && isOptionDisabled(filteredOptions, nextIndex)) {
      nextIndex--;
    }
    return nextIndex >= 0 ? nextIndex : currentIndex;
  }

  return currentIndex;
};
