import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between px-4 md:px-6">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2024 DealClosers.ai. All rights reserved.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline">
            Terms
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline">
            Privacy
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}

