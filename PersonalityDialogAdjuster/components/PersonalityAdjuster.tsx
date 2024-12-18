"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Attribute {
  name: string
  icon: string
  description: string
  value: number
}

const personalityAttributes: Attribute[] = [
  { name: "Politeness", icon: "🤝", description: "How courteous and respectful one's language and demeanor are.", value: 5 },
  { name: "Verbosity", icon: "🗣", description: "The level of detail, length, and descriptiveness in communication.", value: 5 },
  { name: "Formality", icon: "🎩", description: "The degree of professionalism, formality, and adherence to polite conventions.", value: 5 },
  { name: "Empathy", icon: "❤️", description: "The capacity to understand, care about, and respond sensitively to others' feelings.", value: 5 },
  { name: "Assertiveness", icon: "⚖️", description: "The balance between confidently expressing opinions and respecting others' perspectives.", value: 5 },
  { name: "Sociability", icon: "🌐", description: "The inclination toward being outgoing, friendly, and engaging in social interaction.", value: 5 },
  { name: "Language Skills", icon: "📝", description: "The ability to adapt speech to the audience, context, and cultural norms.", value: 5 },
  { name: "Jargon Use", icon: "📚", description: "The level of technical or specialized language employed.", value: 5 },
  { name: "Emotional Stability", icon: "🌊", description: "The steadiness of one's mood, resilience under stress, and overall composure.", value: 5 },
  { name: "Patience", icon: "🕰", description: "The ability to remain calm, composed, and tolerant in the face of delays or difficulties.", value: 5 },
  { name: "Motivational", icon: "🚀", description: "How encouraging, supportive, and uplifting one is.", value: 5 },
  { name: "Honesty", icon: "🌱", description: "The degree of transparency, truthfulness, and willingness to be straightforward.", value: 5 },
  { name: "Conscientiousness", icon: "✔️", description: "The level of diligence, attention to detail, and reliability in one's actions.", value: 5 },
  { name: "Confidence", icon: "💪", description: "How self-assured and decisive one is, without excessive doubt or hesitation.", value: 5 },
  { name: "Experience", icon: "🔧", description: "The depth of familiarity, skill, and knowledge one draws upon.", value: 5 },
  { name: "Analytical", icon: "🧠", description: "The thoroughness and depth of thinking and problem-solving.", value: 5 },
  { name: "Curiosity", icon: "🧐", description: "The tendency to seek more information, ask questions, and explore new ideas.", value: 5 },
  { name: "Creativity", icon: "💡", description: "The frequency of offering innovative ideas and novel solutions.", value: 5 },
  { name: "Optimistic", icon: "☀️", description: "The degree of positive outlook, focusing on potential good outcomes.", value: 5 },
  { name: "Risk Tolerance", icon: "🎲", description: "Comfort with uncertainty and openness to trying new approaches.", value: 5 },
]

export function PersonalityAdjuster() {
  const [attributes, setAttributes] = useState(personalityAttributes)
  const [open, setOpen] = useState(false)

  const handleAttributeChange = (index: number, newValue: number) => {
    setAttributes(prev => prev.map((attr, i) =>
      i === index ? { ...attr, value: newValue } : attr
    ))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adjust Personality</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="space-y-1">
          <DialogTitle>Adjust Personality</DialogTitle>
          <DialogDescription>
            Fine-tune the personality attributes to create your desired profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {attributes.map((attribute, index) => (
            <div key={attribute.name} className="flex items-center justify-between gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-start w-[140px]">
                      <span className="mr-2 text-base">{attribute.icon}</span>
                      <span className="text-xs font-medium truncate">{attribute.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="max-w-[200px] text-xs">{attribute.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-2">
                <Slider
                  className="w-[100px]"
                  min={1}
                  max={10}
                  step={1}
                  value={[attribute.value]}
                  onValueChange={([newValue]) => handleAttributeChange(index, newValue)}
                />
                <span className="text-xs tabular-nums w-6 text-right">{attribute.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => {
            console.log(JSON.stringify(attributes, null, 2))
            setOpen(false)
          }}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

