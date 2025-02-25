import React from "react";

interface DuolingoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const DuolingoInput: React.FC<DuolingoInputProps> = ({
  label,
  error,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-md font-semibold text-gray-900 mb-1.5">
          {label}
        </label>
      )}
      <input
        {...props}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 text-gray-900 
          border-2 border-b-4 rounded-lg 
          transition-colors
          ${
            disabled
              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-200 focus:border-purple-400 focus:outline-none"
          }
          ${error ? "border-red-300 focus:border-red-400" : ""}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DuolingoInput;
