import { ComponentPropsWithRef, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

const controlClasses =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors duration-200 placeholder:text-muted/60 hover:border-muted/40 focus:border-brand focus:ring-4 focus:ring-brand/10";

const iconWrapperClasses =
  "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted transition-colors duration-200 peer-focus:text-brand";

const labelClasses = "mb-1.5 block text-sm font-medium text-ink-soft";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  hint?: string;
  labelHidden?: boolean;
  labelClassName?: string;
  className?: string;
  children: ReactNode;
}

// Wraps a form control with its label and optional hint text.
const FieldShell = ({ label, htmlFor, hint, labelHidden, labelClassName, className, children }: FieldShellProps) => (
  <div className={className}>
    <label htmlFor={htmlFor} className={labelClassName ?? (labelHidden ? "sr-only" : labelClasses)}>
      {label}
    </label>
    {children}
    {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
  </div>
);

type TextFieldProps = ComponentPropsWithRef<"input"> & {
  label: string;
  id: string;
  hint?: string;
  icon?: ReactNode;
  labelHidden?: boolean;
  labelClassName?: string;
  wrapperClassName?: string;
};

// Labelled single line input used across every form section.
export const TextField = ({
  label,
  id,
  hint,
  icon,
  labelHidden,
  labelClassName,
  wrapperClassName,
  className,
  ...inputProps
}: TextFieldProps) => (
  <FieldShell label={label} htmlFor={id} hint={hint} labelHidden={labelHidden} labelClassName={labelClassName} className={wrapperClassName}>
    <div className="relative">
      <input
        id={id}
        className={`peer ${controlClasses} ${icon ? "pl-10" : ""} ${className ?? ""}`}
        {...inputProps}
      />
      {icon ? <span className={iconWrapperClasses}>{icon}</span> : null}
    </div>
  </FieldShell>
);

type TextareaFieldProps = ComponentPropsWithRef<"textarea"> & {
  label: string;
  id: string;
  hint?: string;
  labelHidden?: boolean;
  labelClassName?: string;
  wrapperClassName?: string;
};

// Labelled multi line input for addresses and descriptions.
export const TextareaField = ({
  label,
  id,
  hint,
  labelHidden,
  labelClassName,
  wrapperClassName,
  className,
  ...textareaProps
}: TextareaFieldProps) => (
  <FieldShell label={label} htmlFor={id} hint={hint} labelHidden={labelHidden} labelClassName={labelClassName} className={wrapperClassName}>
    <textarea id={id} className={`${controlClasses} resize-y ${className ?? ""}`} {...textareaProps} />
  </FieldShell>
);

type SelectFieldProps = ComponentPropsWithRef<"select"> & {
  label: string;
  id: string;
  hint?: string;
  icon?: ReactNode;
  labelHidden?: boolean;
  labelClassName?: string;
  wrapperClassName?: string;
};

// Labelled dropdown used for company, invoice type and month pickers.
export const SelectField = ({
  label,
  id,
  hint,
  icon,
  labelHidden,
  labelClassName,
  wrapperClassName,
  className,
  children,
  ...selectProps
}: SelectFieldProps) => (
  <FieldShell label={label} htmlFor={id} hint={hint} labelHidden={labelHidden} labelClassName={labelClassName} className={wrapperClassName}>
    <div className="relative">
      <select
        id={id}
        className={`peer ${controlClasses} cursor-pointer appearance-none pr-10 ${icon ? "pl-10" : ""} ${className ?? ""}`}
        {...selectProps}
      >
        {children}
      </select>
      {icon ? <span className={iconWrapperClasses}>{icon}</span> : null}
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted transition-colors duration-200 peer-focus:text-brand" />
    </div>
  </FieldShell>
);
