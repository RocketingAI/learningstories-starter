import './test-component-6.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "./theme-provider"
import { InteractiveContainers2 } from "./interactive-containers-2"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chat Assistant',
  description: 'An interactive chat assistant with document generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24 bg-[#1a1a1a]">
          <div className="z-10 w-full max-w-[1600px] items-center justify-between font-mono text-sm">

            <InteractiveContainers2 />
          </div>
        </main>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


