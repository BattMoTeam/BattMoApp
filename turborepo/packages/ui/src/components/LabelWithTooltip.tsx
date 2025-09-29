import { Button } from '@workspace/ui/components/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@workspace/ui/components/tooltip'

type Props = {
  label: string
  tooltipText: string
}

export default function LabelWithTooltip(props: Props) {
  const label = props.label
  const tooltipText = props.tooltipText

  return (
    <TooltipProvider delayDuration={0}>
      <div className='flex items-center space-x-2'>
        <span className='text-accent-foreground px-3 text-sm font-medium'>
          {label}
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-0'
            >
              <span className='font-bold'>?</span>
            </Button>
          </TooltipTrigger>

          <TooltipContent className='px-2 py-1 text-xs'>
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
