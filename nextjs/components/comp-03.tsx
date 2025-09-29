import { useId } from "react"

import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with helper text</Label>
      <Input id={id} placeholder="Email" type="email" />
      <p
        className="text-muted-foreground mt-2 text-xs"
        role="region"
        aria-live="polite"
      >
        We won&lsquo;t share your email with anyone
      </p>
    </div>
  )
}
