export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  step,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-brand-text-primary mb-1.5 block text-xs font-bold">
          {label} {required && <span className="text-alert-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="border-brand-border bg-brand-dark/90 text-brand-text-primary placeholder:text-brand-text-subtle focus:border-brand-primary focus:bg-brand-surface focus:ring-brand-primary/30 w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
