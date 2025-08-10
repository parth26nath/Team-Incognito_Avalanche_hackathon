import { LockIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={`flex flex-col items-center text-center max-w-sm ${className}`}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500 rounded-full transform translate-x-10" />
        <div className="relative z-10 p-3 bg-teal-200 rounded-full">
          <LockIcon className="w-6 h-6 text-teal-700" />
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
