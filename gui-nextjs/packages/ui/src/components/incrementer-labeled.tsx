'use client'

import IncrementerUnits from '@workspace/ui/components/incrementer-units.js'
import LabelWithTooltip from '@workspace/ui/components/label-with-tooltip.js'

type Props = {
  label: string
  tooltip: string
  start: number
  min?: number
  max?: number
  step?: number
  unit?: string
}

export default function IncrementerLabeled(props: Props) {
  const label = props.label

  return (
    <div className='flex flex-col space-y-2'>
      <LabelWithTooltip label={props.label} tooltipText={props.tooltip} />

      <IncrementerUnits
        start={props.start}
        min={props.min}
        max={props.max}
        step={props.step}
        unit={props.unit}
      />
    </div>
  )
}
