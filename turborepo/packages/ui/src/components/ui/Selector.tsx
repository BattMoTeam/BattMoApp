import { useId } from 'react'

import { Label } from '@ui/components/ui/label'
import { SelectNative } from '@ui/components/ui/select-native'

type Props = {
  label: string
  helper_text?: string
  options: string[]
}

export default function Selector(props: Props) {
  const label = props.label
  const helper_text = props.helper_text === undefined ? '' : props.helper_text
  const options = props.options

  const id = useId()

  return (
    <div className='*:not-first:mt-2'>
      <Label htmlFor={id} className='text-accent-foreground'>
        {label}
      </Label>
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
