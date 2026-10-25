export default function Button({
  children,
  onClick,
  type = "button",
  isLoading = false,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  className = "",
}) {
  const baseStyle =
    "px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ";
  const variants = {
    primary:
      "bg-brand-primary text-brand-text-primary hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/25 hover:-translate-y-0.5",
    secondary:
      "bg-brand-surface text-brand-text-secondary hover:bg-brand-surface-elevated border border-brand-border",
    danger:
      "bg-alert-danger text-brand-text-primary hover:opacity-90 shadow-md shadow-alert-danger/20",
    outline:
      "border border-brand-border bg-brand-dark/60 text-brand-text-secondary hover:border-brand-primary hover:text-brand-text-primary",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? "w-full py-3.5 text-base" : ""} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="animate-spin text-xl">⏳</span> Đang xử lý...
        </>
      ) : (
        children
      )}
    </button>
  );
}
