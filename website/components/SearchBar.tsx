import { Input } from "./Input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-4">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search members..."
      />
      <button className="text-gray-400">✨</button>
    </div>
  );
} 