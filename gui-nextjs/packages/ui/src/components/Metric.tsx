// Define the shape of one metric
export type MetricType = {
  value: string | number
  label: string
}

// Props for the Metric component
interface MetricProps {
  value: string | number
  label: string
}

export default function Metric({ value, label }: MetricProps) {
  return (
    <div className="flex-1 text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}