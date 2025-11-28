import React from "react";
import classNames from "classnames";
import styles from "./select.module.css";
import { SelectOption as SelectOptionType } from "./types";
import { baseClassName } from "./styles";

export type SelectOptionItemProps = {
  option: SelectOptionType;
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isKeyboardNav: boolean;
  onOptionClick: (event: React.MouseEvent<HTMLDivElement>, option: SelectOptionType) => void;
  onMouseEnter: (index: number) => void;
  onMouseMove: () => void;
};

export function SelectOptionItem(props: SelectOptionItemProps) {
  const {
    option,
    index,
    isSelected,
    isHighlighted,
    isKeyboardNav,
    onOptionClick,
    onMouseEnter,
    onMouseMove,
  } = props;

  const optionClassNames = classNames(
    styles[`${baseClassName}__option`],
    {
      [styles[`${baseClassName}__option--selected`]]: isSelected,
      [styles[`${baseClassName}__option--highlighted`]]: isHighlighted,
      [styles[`${baseClassName}__option--disabled`]]: option.disabled,
      [styles[`${baseClassName}__option--no-hover`]]: isKeyboardNav && !isHighlighted,
    }
  );

  return (
    <div
      data-option-index={index}
      className={optionClassNames}
      onClick={(e) => onOptionClick(e, option)}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseMove={onMouseMove}
    >
      <span className={styles[`${baseClassName}__option-label`]}>
        {option.label}
      </span>
    </div>
  );
}
