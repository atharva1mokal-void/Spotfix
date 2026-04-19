"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-card-bg group-[.toaster]:backdrop-blur-[15px] group-[.toaster]:text-text-primary group-[.toaster]:border-card-border/20 group-[.toaster]:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:p-4 group-[.toaster]:transition-all group-[.hover-antigravity]:hover:-translate-y-1 overflow-hidden relative",
          description: "group-[.toast]:text-text-secondary group-[.toast]:text-xs group-[.toast]:font-semibold group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:mt-1",
          actionButton: "group-[.toast]:bg-accent/10 group-[.toast]:text-accent group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-transparent group-[.toast]:text-text-secondary group-[.toast]:hover:text-text-primary",
          error: "group-[.toaster]:bg-red-500/10 group-[.toaster]:border-red-500/20 group-[.toaster]:text-red-500 group-[.toast]:shadow-[0_20px_40px_rgba(239,68,68,0.15)]",
          success: "group-[.toaster]:bg-green-500/10 group-[.toaster]:border-green-500/20 group-[.toaster]:text-green-500",
          warning: "group-[.toaster]:bg-yellow-500/10 group-[.toaster]:border-yellow-500/20 group-[.toaster]:text-yellow-600",
          info: "group-[.toaster]:bg-accent/10 group-[.toaster]:border-accent/20 group-[.toaster]:text-accent",
          title: "group-[.toast]:text-sm group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:tracking-wide",
          icon: "group-[.toast]:w-5 group-[.toast]:h-5 group-[.toast]:mr-2 group-[.toast]:flex group-[.toast]:items-center",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
