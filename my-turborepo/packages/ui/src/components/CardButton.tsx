import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils"; // shadcn utility to merge classes

type CardButtonProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  selected?: boolean;
  className?: string;
} & React.ComponentProps<typeof Button>;

export default function CardButton({
  icon,
  title,
  subtitle,
  selected = false,
  className,
  ...props
}: CardButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex flex-col items-center justify-center w-1/2 md:w-full h-60 rounded-lg border-2 transition-colors text-center px-4",
        "bg-secondary text-primary hover:border-primary hover:border-4 hover:bg-secondary gap-1",
        selected
          ? "border-primary ring-2 ring-primary"
          : "border-muted",
        className
      )}
      {...props}
    >
      {icon && <div className="mb-3 text-5xl">{icon}</div>}
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
    </Button>
  );
}