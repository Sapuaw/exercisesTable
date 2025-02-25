"use client";

import React, { useState, useRef } from "react";
import { Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DropdownOption {
  label: string;
  value: string | number;
}

interface DuolingoDropdownProps {
  options: DropdownOption[];
  value?: string | number | null | (string | number)[];
  onChange?: (value: string | number | null | (string | number)[]) => void;
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "disabled";
  className?: string;
  multiSelect?: boolean;
  searchable?: boolean;
  highlightSelected?: boolean;
  startIcon?: React.ReactNode;
}

const sizeClasses = {
  xs: "px-3 py-1.5 text-xs rounded-lg",
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-base rounded-xl",
  lg: "px-8 py-3 text-lg rounded-xl",
  xl: "px-10 py-4 text-xl rounded-xl",
} as const;

const variantClasses = {
  primary: "bg-purple-500 border-purple-700 text-white shadow-purple-700",
  secondary: "bg-white border-gray-200 text-gray-700 shadow-gray-200",
  disabled: "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed",
  active: "bg-purple-50 border-purple-300 text-purple-700 shadow-purple-300",
} as const;

export const DuolingoDropdown: React.FC<DuolingoDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecionar",
  size = "md",
  variant = "secondary",
  className = "",
  multiSelect = false,
  searchable = false,
  highlightSelected = false,
  startIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = multiSelect
    ? options.filter((opt) => Array.isArray(value) && value.includes(opt.value))
    : options.filter((opt) => opt.value === value);

  const displayText =
    selectedOptions.length > 0
      ? multiSelect && selectedOptions.length > 2
        ? `${selectedOptions.length} selecionados`
        : selectedOptions.map((opt) => opt.label).join(", ")
      : placeholder;

  const hasValue = multiSelect
    ? Array.isArray(value) && value.length > 0
    : value && value !== "";

  const effectiveVariant =
    variant === "secondary" && hasValue && highlightSelected
      ? "active"
      : variant;
  const shadowColor = {
    primary: "#7e22ce",
    secondary: "#e4e4e7",
    disabled: "#e4e4e7",
    active: "#d8b4fe",
  }[effectiveVariant];

  const handleClick = () => {
    if (variant === "disabled") return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  const filteredOptions = searchable
    ? options
        .filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : options;

  const handleOptionClick = (option: DropdownOption) => {
    if (multiSelect) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.findIndex((v) => v === option.value);
      if (index === -1) {
        newValue.push(option.value);
      } else {
        newValue.splice(index, 1);
      }
      onChange?.(newValue);
    } else {
      const newValue = value === option.value ? null : option.value;
      onChange?.(newValue);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={handleClick}
            disabled={variant === "disabled"}
            className={`
              relative w-full
              ${variantClasses[effectiveVariant]}
              border-2
              font-bold
              ${sizeClasses[size]}
              transition-all duration-150 ease-in-out
              ${
                variant === "disabled"
                  ? "translate-y-[4px]"
                  : isClicked || (hasValue && highlightSelected)
                  ? `translate-y-[4px] shadow-[0_0px_0_0_${shadowColor}]`
                  : isOpen
                  ? `translate-y-[4px] shadow-[0_0px_0_0_${shadowColor}]`
                  : `hover:translate-y-[2px] hover:shadow-[0_2px_0_0_${shadowColor}] shadow-[0_4px_0_0_${shadowColor}]`
              }
            `}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center space-x-2 min-w-0">
                {startIcon && <span className="shrink-0">{startIcon}</span>}
                <span className="truncate">{displayText}</span>
              </div>
              <svg
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 border-gray-100 border-2 border-b-4 bg-white rounded-xl shadow-lg"
          align="start"
        >
          <div className="flex flex-col">
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-sm border-2 border-b-4 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <div
              className={`${
                searchable || multiSelect ? "max-h-64 overflow-y-auto" : ""
              }`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`
                      w-full px-4 py-2 text-left hover:bg-gray-50 
                      ${
                        multiSelect
                          ? Array.isArray(value) && value.includes(option.value)
                            ? "bg-gray-50 font-bold"
                            : ""
                          : value === option.value
                          ? "bg-gray-50 font-bold"
                          : ""
                      }
                    `}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {multiSelect &&
                        Array.isArray(value) &&
                        value.includes(option.value) && (
                          <Check className="w-5 h-5 text-purple-500" />
                        )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DuolingoDropdown;
