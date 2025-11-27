import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./select.module.css";
import { SelectOption } from "./types";
import { getFilteredOptions, getSelectedOption, findNextValidIndex, isValidHighlightedIndex } from "./utils";
import { InputText, InputTextProps } from "../inputText/InputText";
import { SelectOptionItem, SelectOptionItemProps } from "./SelectOptionItem";
import { baseClassName } from "./styles";

export type SelectSize = "sm" | "md" | "lg";

export type SelectProps = {
  options: SelectOption[];
  value?: string | null;

  placeholder?: string;
  disabled?: boolean;
  showSearch?: boolean;
  loading?: boolean;

  allowClear?: boolean;
  hasError?: boolean;
  fullWidth?: boolean;

  size?: SelectSize;
  className?: string;

  onChange?: (value: string | null, option?: SelectOption | null) => void;
  onInputChange?: (keyword: string) => void;
}

const INITIAL_VALUES = {
  HIGHLIGHTED_INDEX: -1,
  KEYBOARD_NAV: false,
  IS_OPTIONS_OPEN: false,
  SEARCH_TERM: "",
}

export function Select(props: SelectProps) {
  const {
    options,
    value = null,
    onChange,
    onInputChange,
    placeholder = "Select...",
    disabled = false,
    showSearch = false,
    loading = false,
    allowClear = true,
    hasError = false,
    fullWidth = false,
    size = "md",
    className = "",
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isScrollingRef = useRef(false);

  const [isOptionsOpen, setIsOptionsOpen] = useState(INITIAL_VALUES.IS_OPTIONS_OPEN);
  const [searchTerm, setSearchTerm] = useState(INITIAL_VALUES.SEARCH_TERM);
  const [highlightedIndex, setHighlightedIndex] = useState(INITIAL_VALUES.HIGHLIGHTED_INDEX);
  const [isKeyboardNav, setIsKeyboardNav] = useState(INITIAL_VALUES.KEYBOARD_NAV);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const selectedOption = getSelectedOption({ options, value: value ?? '' });
  const filteredOptions = getFilteredOptions({
    options,
    searchTerm,
    showSearch,
  });
  const displayLabel = selectedOption?.label ?? "";
  const isFilterOptionsEmpty = filteredOptions.length === 0;
  const showNoOptionsMessage = isFilterOptionsEmpty && !loading;
  const showClearButton = allowClear && selectedOption && !disabled && !loading;

  const rootClassNames = classNames(
    styles[baseClassName],
    styles[`${baseClassName}--size-${size}`],
    {
      [styles[`${baseClassName}--open`]]: isOptionsOpen,
      [styles[`${baseClassName}--disabled`]]: disabled,
      [styles[`${baseClassName}--error`]]: hasError,
      [styles[`${baseClassName}--full-width`]]: fullWidth,
      [styles[`${baseClassName}--dropdown-top`]]: dropdownPosition === 'top',
    },
    className
  );

  // Calculate dropdown position
  useEffect(() => {
    if (!isOptionsOpen || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 220;

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  }, [isOptionsOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOptionsOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOptionsOpen(INITIAL_VALUES.IS_OPTIONS_OPEN);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOptionsOpen]);

  // Adjust highlighted index when filtered options change
  useEffect(() => {
    if (!isOptionsOpen) {
      setHighlightedIndex(INITIAL_VALUES.HIGHLIGHTED_INDEX);
      setIsKeyboardNav(INITIAL_VALUES.KEYBOARD_NAV);
      isScrollingRef.current = false;
      setSearchTerm(INITIAL_VALUES.SEARCH_TERM);
      if (showSearch) {
        onInputChange?.(INITIAL_VALUES.SEARCH_TERM);
      }
      return;
    }

    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }

    if (isFilterOptionsEmpty) {
      setHighlightedIndex(INITIAL_VALUES.HIGHLIGHTED_INDEX);
      return;
    }

    const isCurrentIndexValid = isValidHighlightedIndex(filteredOptions, highlightedIndex);
    if (!isCurrentIndexValid) {
      const firstValidIndex = filteredOptions.findIndex(opt => opt && !opt.disabled);
      if (firstValidIndex >= 0) {
        setHighlightedIndex(firstValidIndex);
      }
    }
  }, [filteredOptions, isOptionsOpen, highlightedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOptionsOpen || isFilterOptionsEmpty) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          {
            e.preventDefault();
            setIsKeyboardNav(true);
            isScrollingRef.current = true;
            setHighlightedIndex((prev) => findNextValidIndex(filteredOptions, prev, 'down'));
          }
          break;

        case 'ArrowUp':
          {
            e.preventDefault();
            setIsKeyboardNav(true);
            isScrollingRef.current = true;
            setHighlightedIndex((prev) => findNextValidIndex(filteredOptions, prev, 'up'));
          }
          break;

        case 'Enter':
          {
            e.preventDefault();
            const isCurrentIndexValid = isValidHighlightedIndex(filteredOptions, highlightedIndex);
            if (isCurrentIndexValid) {
              const option = filteredOptions[highlightedIndex];
              onChange?.(option.value, option);
              setIsOptionsOpen(INITIAL_VALUES.IS_OPTIONS_OPEN);
              setSearchTerm(INITIAL_VALUES.SEARCH_TERM);
              if (showSearch) {
                onInputChange?.(INITIAL_VALUES.SEARCH_TERM);
              }
            }
          }
          break;

        case 'Escape':
          {
            e.preventDefault();
            setIsOptionsOpen(INITIAL_VALUES.IS_OPTIONS_OPEN);
          }
          break;

        case 'Tab':
          {
            setIsOptionsOpen(INITIAL_VALUES.IS_OPTIONS_OPEN);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOptionsOpen, highlightedIndex, filteredOptions, showSearch]);


  // Scroll highlighted option into view
  useEffect(() => {
    if (!isOptionsOpen || highlightedIndex < 0 || !dropdownRef.current) {
      return;
    }

    const highlightedElement = dropdownRef.current.querySelector(
      `[data-option-index="${highlightedIndex}"]`
    );

    highlightedElement?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [highlightedIndex, isOptionsOpen]);


  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsOptionsOpen((prev) => {
      const next = !prev;
      if (next && showSearch) {
        setSearchTerm(displayLabel);
      }
      return next;
    });
  };

  const handleOptionClick: SelectOptionItemProps['onOptionClick'] = (event, option) => {
    event.stopPropagation();
    if (option.disabled) {
      return;
    }

    onChange?.(option.value, option);
    setIsOptionsOpen(INITIAL_VALUES.IS_OPTIONS_OPEN);
    setSearchTerm(INITIAL_VALUES.SEARCH_TERM);
    if (showSearch) {
      onInputChange?.(INITIAL_VALUES.SEARCH_TERM);
    }
  };

  const handleOptionMouseEnter: SelectOptionItemProps['onMouseEnter'] = (index) => {
    if (isKeyboardNav || isScrollingRef.current) {
      return;
    }

    // handle don't change highlight index when option disabled
    const option = filteredOptions[index];
    if (option?.disabled) {
      return;
    }

    setHighlightedIndex(index);
  };

  const handleOptionMouseMove: SelectOptionItemProps['onMouseMove'] = () => {
    isScrollingRef.current = false;
    if (isKeyboardNav) {
      setIsKeyboardNav(INITIAL_VALUES.KEYBOARD_NAV);
    }
  };

  const handleInputClick: InputTextProps['onClick'] = (e) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }

    setIsOptionsOpen(true);
    setSearchTerm((current) => current || selectedOption?.label || INITIAL_VALUES.SEARCH_TERM);
  };

  const handleInputFocus: InputTextProps['onFocus'] = () => {
    if (disabled) {
      return;
    }

    setIsOptionsOpen(true);
    setSearchTerm((current) => current || selectedOption?.label || INITIAL_VALUES.SEARCH_TERM);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }

    setHighlightedIndex(INITIAL_VALUES.HIGHLIGHTED_INDEX);
    onChange?.(null, null);
    setSearchTerm(INITIAL_VALUES.SEARCH_TERM);
    if (showSearch) {
      onInputChange?.(INITIAL_VALUES.SEARCH_TERM);
    }
  };

  const handleSearchChange: InputTextProps['onChange'] = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    onInputChange?.(text);
    if (!isOptionsOpen && !disabled) {
      setIsOptionsOpen(true);
    }
  };

  const handleInputKeyDown: InputTextProps['onKeyDown'] = (e) => {
    if (e.key === 'ArrowDown' && !isOptionsOpen && !disabled) {
      e.preventDefault();
      setIsOptionsOpen(true);
      setSearchTerm((current) => current || selectedOption?.label || INITIAL_VALUES.SEARCH_TERM);
    }
  };

  return (
    <div className={rootClassNames} ref={containerRef}>
      <div
        className={styles[`${baseClassName}__control`]}
        onClick={handleToggle}
        aria-disabled={disabled}
      >
        <div className={styles[`${baseClassName}__value-wrapper`]}>
          {showSearch ? (
            <InputText
              ref={inputRef}
              size={size}
              value={isOptionsOpen ? searchTerm : displayLabel}
              onChange={handleSearchChange}
              placeholder={placeholder}
              disabled={disabled}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              onKeyDown={handleInputKeyDown}
            />
          ) : (
            <span
              className={classNames(
                styles[`${baseClassName}__value`],
                { [styles[`${baseClassName}__value--placeholder`]]: !displayLabel }
              )}
            >
              {displayLabel || placeholder}
            </span>
          )}
        </div>

        <div className={styles[`${baseClassName}__suffix`]}>
          {showClearButton && (
            <button
              type="button"
              className={styles[`${baseClassName}__clear`]}
              onClick={handleClear}
              aria-label="Clear selection"
            >
              ×
            </button>
          )}
          {loading && (
            <span className={styles[`${baseClassName}__spinner`]} aria-hidden="true" />
          )}
          <span
            className={classNames(
              styles[`${baseClassName}__arrow`],
              { [styles[`${baseClassName}__arrow--open`]]: isOptionsOpen }
            )}
          />
        </div>

        {isOptionsOpen && (
          <div className={styles[`${baseClassName}__dropdown`]} ref={dropdownRef}>
            {loading && (
              <div className={classNames(
                styles[`${baseClassName}__option`],
                styles[`${baseClassName}__option--empty`]
              )}>
                Loading...
              </div>
            )}
            {showNoOptionsMessage && (
              <div className={classNames(
                styles[`${baseClassName}__option`],
                styles[`${baseClassName}__option--empty`]
              )}>
                No options found
              </div>
            )}

            {filteredOptions.map((opt, index) => (
              <SelectOptionItem
                key={opt.value}
                option={opt}
                index={index}
                isSelected={opt.value === value}
                isHighlighted={index === highlightedIndex}
                isKeyboardNav={isKeyboardNav}
                onOptionClick={handleOptionClick}
                onMouseEnter={handleOptionMouseEnter}
                onMouseMove={handleOptionMouseMove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
