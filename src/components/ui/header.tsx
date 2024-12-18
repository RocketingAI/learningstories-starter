import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-bold">
          DealClosers.ai
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-sm font-medium">
            Pricing
          </Link>
        </nav>
        <Button>Get Started</Button>
      </div>
    </header>
  )
}

