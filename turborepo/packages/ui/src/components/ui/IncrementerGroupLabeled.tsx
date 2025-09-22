'use client'

import IncrementerGroup from '@ui/components/ui/IncrementerGroup'
import LabelWithTooltip from '@ui/components/ui/LabelWithTooltip'

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
