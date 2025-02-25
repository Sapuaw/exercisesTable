"use client";

import React, { useState } from "react";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant = "white" | "orange" | "purple" | "red";

interface DuolingoButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  size?: ButtonSize;
  fullWidth?: boolean;
  centered?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  muted?: boolean;
  isLoading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-xs rounded-lg",
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-base rounded-xl",
  lg: "px-8 py-3 text-lg rounded-xl",
  xl: "px-10 py-4 text-xl rounded-xl",
};

const variantClasses: Record<
  ButtonVariant,
  {
    bg: string;
    border: string;
    shadow: string;
    shadowClicked: string;
    text: string;
  }
> = {
  purple: {
    bg: "bg-purple-500",
    border: "border-purple-700",
    shadow: "hover:shadow-[0_2px_0_0_#7E22CE] shadow-[0_4px_0_0_#7E22CE]",
    shadowClicked: "shadow-[0_0px_0_0_#7E22CE]",
    text: "text-white",
  },
  white: {
    bg: "bg-white",
    border: "border-gray-200",
    shadow: "hover:shadow-[0_2px_0_0_#E5E7EB] shadow-[0_4px_0_0_#E5E7EB]",
    shadowClicked: "shadow-[0_0px_0_0_#E5E7EB]",
    text: "text-gray-600",
  },
  orange: {
    bg: "bg-orange-500",
    border: "border-orange-700",
    shadow: "hover:shadow-[0_2px_0_0_#c2410c] shadow-[0_4px_0_0_#c2410c]",
    shadowClicked: "shadow-[0_0px_0_0_#c2410c]",
    text: "text-white",
  },

  red: {
    bg: "bg-red-500",
    border: "border-red-700",
    shadow: "hover:shadow-[0_2px_0_0_#FEE2E2] shadow-[0_4px_0_0_#FEE2E2]",
    shadowClicked: "shadow-[0_0px_0_0_#FEE2E2]",
    text: "text-white",
  },
};

export const DuolingoButton: React.FC<DuolingoButtonProps> = ({
  onClick,
  size = "md",
  fullWidth = false,
  centered = true,
  disabled = false,
  variant = "purple",
  muted = false,
  isLoading = false,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const variantStyle = variantClasses[variant];

  const handleClick = () => {
    if (!muted && !disabled) {
      setIsClicked(true);
      onClick?.();
      setTimeout(() => setIsClicked(false), 200);
    }
  };

  const isInactive = muted || disabled || isLoading;

  return (
    <button
      onClick={handleClick}
      className={`
        relative
        ${
          isInactive
            ? `bg-gray-200 border-gray-300 text-gray-400 translate-y-[4px] shadow-[0_0px_0_0_#E5E7EB]`
            : `${variantStyle.bg} ${variantStyle.border} ${variantStyle.text} ${
                isClicked
                  ? `translate-y-[4px] ${variantStyle.shadowClicked}`
                  : `hover:translate-y-[2px] ${variantStyle.shadow}`
              }`
        }
        border-2
        font-bold
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : "inline-block"}
        ${centered ? "flex items-center justify-center gap-2" : "text-left"}
        transition-all duration-150 ease-in-out
        ${isInactive ? "cursor-not-allowed" : "cursor-pointer"}
      `}
      disabled={isInactive}
    ></button>
  );
};

export default DuolingoButton;
