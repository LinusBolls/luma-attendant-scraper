type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
  onSubmit?: () => void;
};

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className = "",
  onSubmit,
}: InputProps) {
  return (
    <div className="flex gap-3 items-center">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 rounded-full bg-[#787878] text-white placeholder-white font-['SF_Pro_Rounded'] focus:outline-none focus:ring-2 focus:ring-white/20 ${className}`}
      />
      <button 
        onClick={onSubmit}
        type="submit"
        className="flex-shrink-0 w-[49px] h-[49px] hover:bg-[#888888] transition-colors flex items-center justify-center"
      >
        <img src="/arrow-up.svg" alt="Submit" width={49} height={49} />
      </button>
    </div>
  );
} 