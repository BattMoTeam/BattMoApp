import Incrementer from '@/components/eibar/Incrementer'
import IncrementerUnits from '@/components/eibar/IncrementerUnits'
import IncrementerLabeled from '@/components/eibar/IncrementerLabeled'
import LabelWithTooltip from '@/components/eibar/LabelWithTooltip'
import IncrementerGroup from '@/components/eibar/IncrementerGroup'
import IncrementerGroupLabeled from '@/components/eibar/IncrementerGroupLabeled'

export default function LibraryPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold'>Component playground Eibar</h1>

      <p className='mt-4'>Incrementer</p>
      <Incrementer start={0} />

      <p className='mt-4'>Incrementer with units</p>
      <IncrementerUnits start={4} min={0.0} max={10} step={1} unit='cm' />

      <p className='mt-4'>Label with tooltip</p>
      <LabelWithTooltip label='Lenght' tooltipText='This is a lenght' />

      <p className='mt-4'>Incrementer with label</p>
      <IncrementerLabeled
        label={'Lenght'}
        tooltip='This is a lenght'
        start={4}
        min={0.0}
        max={10}
        step={1}
        unit='cm'
      />

      <p className='mt-4'>Incrementer group with label</p>
      <IncrementerGroupLabeled
        label={'Electrode Composition'}
        tooltipText='AM: Active Material, CA: Conductive Additive, BD: Binder'
      />
    </div>
  )
}
