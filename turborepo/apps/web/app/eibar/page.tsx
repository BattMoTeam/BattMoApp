import Incrementer from '@ui/components/Incrementer'
import IncrementerUnits from '@ui/components/IncrementerUnits'
import IncrementerLabeled from '@ui/components/IncrementerLabeled'
import LabelWithTooltip from '@ui/components/LabelWithTooltip'
import IncrementerGroup from '@ui/components/IncrementerGroup'
import IncrementerGroupLabeled from '@ui/components/IncrementerGroupLabeled'
import Selector from '@ui/components/Selector'
import SelectorWithTooltip from '@ui/components/SelectorWithTooltip'
import TextInputWithTooltip from '@ui/components/TextInputWithTooltip'
import FileUploader from '@ui/components/FileUploader'

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

      <p className='mt-4'>Selector</p>
      <Selector
        label={'Model'}
        helper_text='Choose the physical model for your simulation'
        options={['P2D', 'P4D', 'P4D + thermal', 'P2D + SEI']}
      />

      <p className='mt-4'>Selector with tooltip</p>
      <SelectorWithTooltip
        label={'Cell'}
        tooltip_text='Select the type of cell.'
        options={['Pouch', 'Coin', 'Cylindrical', 'Prismatic']}
      />

      <p className='mt-4'>Text input with tooltip</p>
      <TextInputWithTooltip
        label={'Give the simulation a name'}
        tooltip_text='An informative name helps to find it later on.'
        placeholder_text='cell_4_test_25'
        helper_text='We suggest using snake case'
      />

      <p className='mt-4'>Text upload</p>
      <FileUploader />
    </div>
  )
}
