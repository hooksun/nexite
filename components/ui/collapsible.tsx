"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cn } from "cn"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({
  animated,
  ...props
}: { animated?: boolean } & CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      keepMounted={animated}
      {...props}
      className={cn(
        "overflow-x-visible overflow-y-clip",
        // Triggers Tailwind animations based on Base UI states
        "data-open:animate-collapsible-down data-closed:animate-collapsible-up",
        // Handles unmounting styles smoothly
        "data-ending-style:animate-collapsible-up data-starting-style:animate-collapsible-down",
        // Remaps Base UI's height token to what Tailwind's animation expects
        "[--radix-collapsible-content-height:var(--collapsible-panel-height)]",
        props.className
      )}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
