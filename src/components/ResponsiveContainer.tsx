import { memo } from "react";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer = memo(function ResponsiveContainer({ 
  children, 
  className 
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, orientation } = useResponsiveLayout();

  const containerClasses = cn(
    "w-full transition-all duration-300",
    {
      "px-2 py-1 space-y-2": isMobile,
      "px-4 py-2 space-y-4": isTablet,
      "px-6 py-3 space-y-6": !isMobile && !isTablet,
      "max-w-[100dvw]": orientation === "portrait",
    },
    className
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
});