import type { Metadata } from "next"
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { SkipLink } from "@/components/layout/skip-link"
import "./globals.css"

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
})

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Momentnyckel.se – Hitta rätt momentnyckel",
    template: "%s | Momentnyckel.se",
  },
  description:
    "Hitta och jämför momentnycklar för bil, cykel, verkstad och industri. Produktväljare, produktkatalog och guider.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${figtree.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
