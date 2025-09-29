import { Button } from "@workspace/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

export default function Component() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Tiny
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          This is a simple tooltip
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
