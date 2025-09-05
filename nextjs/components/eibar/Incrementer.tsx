'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  start?: number
  min?: number
  max?: number
  step?: number
  onChange?: (n: number) => void
}

export default function Incrementer(props: Props) {
  const start = props.start === undefined ? 0 : props.start
  const min = props.min === undefined ? -Infinity : props.min
  const max = props.max === undefined ? Infinity : props.max
  const step = props.step === undefined ? 1 : props.step
  const decimals = (step.toString().split('.')[1] || '').length

  const [value, setValue] = useState<number>(() => start)

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const handleUp = () =>
    setValue(prev => {
      const next = clamp(prev + step)
      props.onChange?.(next) // call onChange when value changes
      return next
    })

  const handleDown = () =>
    setValue(prev => {
      const next = clamp(prev - step)
      props.onChange?.(next) // call onChange when value changes
      return next
    })

  useEffect(() => {
    props.onChange?.(value) // notify parent of initial value on mount
  }, []) // keep empty deps to run once on mount

  return (
    <div className='inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse'>
      <Button
        onClick={handleUp}
        className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
        variant='outline'
        size='icon'
        aria-label='Upvote'
      >
        <ChevronUpIcon size={16} aria-hidden='true' />
      </Button>

      <span className='border-input flex items-center border px-3 text-sm font-medium'>
        {value.toFixed(decimals)}
      </span>

      <Button
        onClick={handleDown}
        className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
        variant='outline'
        size='icon'
        aria-label='Downvote'
      >
        <ChevronDownIcon size={16} aria-hidden='true' />
      </Button>
    </div>
  )
}
