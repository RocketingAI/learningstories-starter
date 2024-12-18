import { PersonalityAdjuster } from "@/components/PersonalityAdjuster"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Personality Profile Adjuster</h1>
      <PersonalityAdjuster />
    </main>
  )
}

