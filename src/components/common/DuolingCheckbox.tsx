import { FC } from "react";
import { Check } from "lucide-react";

interface DuolingoCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default";
}

const DuolingoCheckbox: FC<DuolingoCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
  size = "default",
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }}
    disabled={disabled}
    className={`
      ${size === "sm" ? "w-5 h-5" : "w-6 h-6"}
      rounded-lg 
      border-2 
      transition-colors 
      duration-100
      flex items-center justify-center
      ${
        checked
          ? "bg-purple-500 border-purple-700 shadow-[0_2px_0_0_#7e22ce]"
          : "bg-white border-gray-300 shadow-[0_2px_0_0_#d1d5db]"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${className}
    `}
    type="button"
  >
    {checked && (
      <Check
        className={`${
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
        } text-white stroke-[3]`}
      />
    )}
  </button>
);

export default DuolingoCheckbox;
