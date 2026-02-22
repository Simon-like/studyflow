import React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-white border rounded-xl text-charcoal-800 placeholder:text-mist",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral",
              "disabled:bg-warm disabled:cursor-not-allowed",
              error && "border-error focus:ring-error/30 focus:border-error",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              className,
            )}
            disabled={disabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-sm text-stone">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
