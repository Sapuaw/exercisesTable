import React from "react";

interface DuolingoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  labelHidden?: boolean;
  width?: string;
  height?: string;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  maxLength?: number;
  nextRef?: React.RefObject<HTMLInputElement>;
  type?: "email" | "number" | "text" | "password" | "tel" | "url" | "textarea";
}

const DuolingoInput: React.FC<DuolingoInputProps> = ({
  label,
  error,
  className = "",
  disabled,
  labelHidden = false,
  width = "w-full",
  height = "py-2.5",
  inputRef,
  maxLength,
  nextRef,
  type = "text",
  ...props
}) => {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      maxLength &&
      e.currentTarget.value.length === maxLength &&
      nextRef?.current
    ) {
      nextRef.current.focus();
    }
  };

  return (
    <div className={className}>
      {label && !labelHidden && (
        <label className="block text-md font-semibold text-gray-900 mb-1.5">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          disabled={disabled}
          className={`
            w-full px-4 text-gray-900 
            border-2 border-b-4 rounded-lg 
            transition-colors
            ${
              disabled
                ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-200 focus:border-purple-400 focus:outline-none"
            }
            ${error ? "border-red-300 focus:border-red-400" : ""}
          `}
          rows={4}
          style={{ height: "auto", minHeight: "4rem" }}
        />
      ) : (
        <input
          {...props}
          type={type}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          disabled={disabled}
          onKeyUp={handleKeyUp}
          maxLength={maxLength}
          className={`
            ${width} px-4 ${height} text-gray-900 
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
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DuolingoInput;
