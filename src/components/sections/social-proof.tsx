import Image from 'next/image'

export function SocialProofSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">
          Trusted by Industry Leaders
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {['logo1', 'logo2', 'logo3', 'logo4', 'logo5'].map((logo, index) => (
            <div key={index} className="w-32 h-16 relative">
              <Image
                src={`/placeholder.svg?height=64&width=128`}
                alt={`Company logo ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
        <blockquote className="mt-12 text-center">
          <p className="text-xl italic">
            "DealClosers.ai has revolutionized our sales process. We've seen a 30% increase in closed deals since implementing their AI-powered platform."
          </p>
          <footer className="mt-2 text-muted-foreground">
            - Jane Doe, Sales Director at Tech Corp
          </footer>
        </blockquote>
      </div>
    </section>
  )
}

