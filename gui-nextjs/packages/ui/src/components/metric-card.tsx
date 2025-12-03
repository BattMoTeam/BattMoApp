import { Card, CardContent } from "@workspace/ui/components/ui/card"
import Metric, { MetricType } from "@workspace/ui/components/metric"

interface MetricCardProps {
  metrics: MetricType[]
}

export function MetricCard({ metrics }: MetricCardProps) {
    return (
        <Card className="w-full max-w-sm p-4 rounded-2xl shadow-md border">
            <CardContent className="flex justify-between text-center p-0">
                {metrics.map((metric, idx) => (
                <Metric key={idx} value={metric.value} label={metric.label} />
                ))}
            </CardContent>
        </Card>
    )
}
