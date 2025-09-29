import { useId } from 'react'

import { Label } from '@workspace/ui/components/label'
import { SelectNative } from '@workspace/ui/components/select-native'
import LabelWithTooltip from '@workspace/ui/components/LabelWithTooltip'

type Props = {
  label: string
  tooltip_text: string
  helper_text?: string
  options: string[]
}

export default function SelectorWithTooltip(props: Props) {
  const label = props.label
  const helper_text = props.helper_text === undefined ? '' : props.helper_text
  const tooltip_text = props.tooltip_text
  const options = props.options

  const id = useId()

  return (
    <div className='*:not-first:mt-2'>
      <LabelWithTooltip label={label} tooltipText={tooltip_text} />

      <SelectNative id={id}>
        {options.map((opt, i) => (
          <option value={(i + 1).toString()}> {opt} </option>
        ))}
      </SelectNative>
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
