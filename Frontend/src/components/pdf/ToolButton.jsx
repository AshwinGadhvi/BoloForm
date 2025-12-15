
const ToolButton = ({ 
  label, 
  icon, 
  onClick, 
  active = false, 
  variant = "default",
  disabled = false,
  fullWidth = true,
  size = "medium"
}) => {
  
  const sizeClasses = {
    small: "px-2 py-1.5 text-xs",
    medium: "px-3 py-2 text-sm",
    large: "px-4 py-3 text-base"
  };

  const variantClasses = {
    default: `border border-[rgb(var(--border))]
              bg-[rgb(var(--panel))]
              text-[rgb(var(--text))]
              hover:bg-[rgb(var(--bg))]`,
    primary: `border border-[rgb(var(--accent))]
              bg-[rgb(var(--accent))]
              text-white
              hover:opacity-90
              shadow-lg shadow-[rgb(var(--accent))]/20`,
    secondary: `border border-[rgb(var(--border))]
                bg-[rgb(var(--bg))]
                text-[rgb(var(--text))]
                hover:border-[rgb(var(--accent))]
                hover:text-[rgb(var(--accent))]`,
    danger: `border border-red-500
             bg-red-500/10
             text-red-500
             hover:bg-red-500/20`,
  };

  const activeClasses = active 
    ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] shadow-md"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? "w-full" : ""}
        ${sizeClasses[size]}
        rounded-lg text-left font-medium
        flex items-center gap-2
        transition-all duration-200
        ${variantClasses[variant]}
        ${activeClasses}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        group
      `}
      title={label}
    >
      {icon && (
        <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      
      {active && (
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[rgb(var(--accent))]
                       animate-pulse" />
      )}
    </button>
  );
};

export default ToolButton;

