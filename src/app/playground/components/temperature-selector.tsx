"use client"

import * as React from "react"
import * as Slider from "@radix-ui/react-slider"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/registry/new-york/ui/hover-card"
import { Label } from "~/registry/new-york/ui/label"

interface TemperatureSelectorProps {
  defaultValue: number[]
}

export function TemperatureSelector({
  defaultValue,
}: TemperatureSelectorProps) {
  const [value, setValue] = React.useState(defaultValue)

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value[0]}
              </span>
            </div>
            <form className="relative flex w-full touch-none select-none items-center">
              <Slider.Root
                className="relative flex h-5 w-full touch-none select-none items-center"
                defaultValue={value}
                max={1}
                step={0.1}
                onValueChange={setValue}
                id="temperature"
                aria-label="Temperature"
              >
                <Slider.Track className="relative h-1 w-full grow rounded-full bg-secondary">
                  <Slider.Range className="absolute h-full rounded-full bg-primary" />
                </Slider.Track>
                <Slider.Thumb
                  className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                />
              </Slider.Root>
            </form>
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Controls randomness: lowering results in less random completions. As
          the temperature approaches zero, the model will become deterministic
          and repetitive.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
