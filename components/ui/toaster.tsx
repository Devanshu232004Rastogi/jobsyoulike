"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast
              key={id}
              {...props}
              className="bg-white text-black shadow-lg rounded-lg p-4 my-2 max-w-md mx-auto flex items-center justify-between"
            >
              <div className="grid gap-1">
                {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
                {description && <ToastDescription className="text-sm">{description}</ToastDescription>}
              </div>
              {action}
              <ToastClose className="ml-2 cursor-pointer" />
            </Toast>
          );
        })}
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}
