import Image from "next/image";

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
        className={`w-full px-4 py-3 rounded-full bg-[#787878] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/20 ${className}`}
      />
      <button 
        onClick={onSubmit}
        type="submit"
        className="flex-shrink-0 w-[49px] h-[49px] rounded-full bg-[#787878] hover:bg-[#888888] transition-colors flex items-center justify-center"
      >
        <Image 
          src="/arrow-up.svg" 
          alt="Submit" 
          width={24} 
          height={24} 
          className="w-6 h-6"
        />
      </button>
    </div>
  );
} 