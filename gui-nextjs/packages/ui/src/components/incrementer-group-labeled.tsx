'use client'

import IncrementerGroup from '@workspace/ui/components/incrementer-group.js'
import LabelWithTooltip from '@workspace/ui/components/label-with-tooltip.js'

type Props = {
  label: string
  tooltipText: string
}

export default function IncrementerLabeled(props: Props) {
  const label = props.label
  const tooltipText = props.tooltipText

  return (
    <div className='flex flex-col space-y-2'>
      <LabelWithTooltip label={label} tooltipText={tooltipText} />

      <IncrementerGroup />
    </div>
  )
}
