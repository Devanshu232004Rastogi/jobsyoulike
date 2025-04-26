"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Heart } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface SaveJobButtonProps {
  savedJob: boolean;
}

export function SaveJobButton({ savedJob }: SaveJobButtonProps) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      variant="outline" 
      disabled={pending}
    >
      <Heart className={cn("size-4", savedJob ? "fill-primary" : "")} />
      {savedJob ? "Saved" : "Save Job"}
    </Button>
  );
}

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      className={cn(className)} 
      disabled={pending} 
      {...props}
    >
      {pending ? "Applying..." : children}
    </Button>
  );
}