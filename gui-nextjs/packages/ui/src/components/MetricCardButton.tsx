import { Download } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { MetricType } from "@workspace/ui/components/Metric"
import { MetricCard } from "@workspace/ui/components/MetricCard"



interface MetricCardButtonProps {
  metrics: MetricType[]
}

export default function MetricCardButton({ metrics }: MetricCardButtonProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <MetricCard metrics={metrics} />
      
      {/* Footer with simulation button */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="">
          <Download className="h-4 w-4" />
        </Button>
        <Button className="bg-primary">
          Run simulation
        </Button>
      </div>
    </div>
  )
}

