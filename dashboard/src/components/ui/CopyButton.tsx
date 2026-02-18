import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
        copied
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
      } ${className}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "הועתק!" : "העתק"}
    </button>
  );
}
