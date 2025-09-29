'use client'

import { useState } from 'react'
import Incrementer from '@workspace/ui/components/Incrementer'

export default function IncrementerGroup() {
  // initial values
  const [a, setA] = useState(90)
  const [b, setB] = useState(5)

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

  // handlers mirror simple assignments in Python style
  const onA = (v: number) => setA(clamp(v))
  const onB = (v: number) => setB(clamp(v))

  const remaining = 100 - (a + b)
  const remainingLabel = remaining < 0 ? 'Values exceed 100' : String(remaining)

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-3'>
        <span className='w-8 text-sm font-medium'>AM:</span>
        <Incrementer start={a} min={0} max={100} step={1} onChange={onA} />
      </div>

      <div className='flex items-center gap-3'>
        <span className='w-8 text-sm font-medium'>CA:</span>
        <Incrementer start={b} min={0} max={100} step={1} onChange={onB} />
      </div>

      <div className='inline-flex items-center gap-3 -space-x-px rtl:space-x-reverse'>
        <span className='w-8 text-sm font-medium'>BD:</span>
        <span
          className={`border-input flex items-center border px-3 text-sm font-medium shadow-xs ${remaining < 0 ? 'text-red-500' : 'text-inherit'}`}
        >
          {remainingLabel}
        </span>
      </div>
    </div>
  )
}
