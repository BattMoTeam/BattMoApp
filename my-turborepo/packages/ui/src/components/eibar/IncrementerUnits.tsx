'use client'

import Incrementer from '@/components/eibar/Incrementer'

type Props = {
  start: number
  min?: number
  max?: number
  step?: number
  unit?: string
}

export default function IncrementerUnits(props: Props) {
  const unit = props.unit === undefined ? '' : props.unit

  return (
    <div className='inline-flex items-center'>
      <div className='-space-x-px rounded-md shadow-xs rtl:space-x-reverse'>
        <Incrementer
          start={props.start}
          min={props.min}
          max={props.max}
          step={props.step}
        />
      </div>
      <span className='mb-1 px-3 text-sm font-medium italic'>{unit}</span>
    </div>
  )
}
