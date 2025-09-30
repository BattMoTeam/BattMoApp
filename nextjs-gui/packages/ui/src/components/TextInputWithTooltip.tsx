import { useId } from 'react'

import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

import LabelWithTooltip from '@workspace/ui/components/LabelWithTooltip'

type Props = {
  label: string
  tooltip_text: string
  placeholder_text?: string
  helper_text?: string
}

export default function TextInputWithTooltip(props: Props) {
  const label = props.label
  const tooltip_text = props.tooltip_text
  const placeholder_text =
    props.placeholder_text === undefined ? '' : props.placeholder_text
  const helper_text = props.helper_text === undefined ? '' : props.helper_text

  const id = useId()
  return (
    <div className='*:not-first:mt-2'>
      <LabelWithTooltip label={label} tooltipText={tooltip_text} />

      <Input id={id} placeholder={placeholder_text} type='text' />
      <p
        className='text-muted-foreground mt-2 text-xs'
        role='region'
        aria-live='polite'
      >
        {helper_text}
      </p>
    </div>
  )
}
