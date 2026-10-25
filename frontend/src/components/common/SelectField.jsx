export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-brand-text-primary mb-1.5 block text-xs font-bold">
          {label} {required && <span className="text-alert-danger">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="border-brand-border bg-brand-dark/90 text-brand-text-primary focus:border-brand-primary focus:bg-brand-surface focus:ring-brand-primary/30 w-full cursor-pointer rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder && (
          <option value="" className="bg-brand-dark text-brand-text-muted">
            {placeholder}
          </option>
        )}
        {options.map((opt, index) => (
          <option
            key={opt.value ?? index}
            value={opt.value}
            className="bg-brand-dark text-brand-text-primary"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
