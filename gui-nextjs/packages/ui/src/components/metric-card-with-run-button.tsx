import { Download } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import { MetricType } from "@workspace/ui/components/metric"
import { MetricCard } from "@workspace/ui/components/metric-card"



interface MetricCardButtonProps {
  metrics: MetricType[];
  onRun?: () => void;
}

export default function MetricCardButton({ metrics, onRun }: MetricCardButtonProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <MetricCard metrics={metrics} />
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button className="bg-primary" onClick={onRun}>
          Run simulation
        </Button>
      </div>
    </div>
  );
}


