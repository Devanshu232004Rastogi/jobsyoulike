import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // assuming you have a 'cn' (classnames merge) utility

// 1. Define the banner variants
const bannerVariants = cva(
  "border text-center shadow-md p-4 text-sm flex items-center w-full rounded-md",
  {
    variants: {
      variant: {
        warning: "text-black border-red-400 bg-red-100",
        success: "text-black border-green-400 bg-green-100",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

// 2. Icon map for different variants
const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

// 3. Props interface
interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

// 4. Banner component
export const Banner = ({ variant, label }: BannerProps) => {
  const Icon = iconMap[variant || "warning"]; // Default to "warning" if variant is missing

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </div>
  );
};
