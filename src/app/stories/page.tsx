'use client'

import { useRouter } from 'next/navigation'
import { Container } from "~/components/ui/container"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Plus } from "lucide-react"
import { StoriesList } from "~/components/story/stories-list"

export default function StoriesPage() {
  const router = useRouter()

  return (
    <Container>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Stories</h1>
          <p className="text-zinc-400">Manage and track all your learning stories</p>
        </div>
        <Button 
          onClick={() => router.push('/stories/create')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Story
        </Button>
      </div>

      <Card className="bg-zinc-950 border-zinc-800">
        <div className="p-6">
          <StoriesList 
            onView={(story) => router.push(`/stories/${story.id}`)}
            onEdit={(story) => router.push(`/stories/${story.id}/edit`)}
            onDelete={(story) => {
              // TODO: Implement delete functionality
              console.log('Delete story:', story.id)
            }}
          />
        </div>
      </Card>
    </Container>
  )
}
