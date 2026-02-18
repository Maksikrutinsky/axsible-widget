const VARIANTS: Record<string, string> = {
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  gray: "bg-gray-100 text-gray-800",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
}

export function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${VARIANTS[variant] || VARIANTS.gray}`}>
      {children}
    </span>
  );
}
