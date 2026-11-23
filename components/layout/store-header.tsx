"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MiniCartDrawer } from "@/components/storefront/mini-cart-drawer"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { CurrencySelector } from "@/components/layout/currency-selector"
import { SearchBar } from "@/components/storefront/search-bar"
import { storeNavItems, categories, products } from "@/data/seed"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"

export function StoreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const { count: cartCount } = useCart()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Announcement bar */}
      {announcementVisible && (
        <div className="relative bg-foreground text-background text-center text-xs py-2.5 px-4">
          <span>
            Hitta rätt momentnyckel – jämför produkter för bil, cykel och verkstad.
          </span>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss announcement"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <header className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-200",
        scrolled && "shadow-sm"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center gap-4 transition-all duration-200",
            scrolled ? "h-14" : "h-16"
          )}>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="touch-target md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 font-heading font-bold"
            >
              <ShoppingBag className={cn("text-primary transition-all", scrolled ? "h-5 w-5" : "h-6 w-6")} />
              <span className={cn("text-foreground transition-all tracking-tight", scrolled ? "text-base" : "text-lg")}>Momentnyckel.se</g/span>
            </Link>

            {/* Desktop navigation with mega menu */}
            <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Huvudmeny"><Link href="/products" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:text-primary">Alla produkter</Link><Link href="/#valjare" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">Produktväljare</Link><Link href="/#kategorier" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">Kategorier</Link><Link href="/#guide" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">Köpguide</Link></nav>

            {/* Search bar (desktop) */}
            <div className="hidden flex-1 md:block md:max-w-sm lg:max-w-md"><form action="/products" className="relative"><input name="q" placeholder="Sök bland momentnycklar..." className="w-full rounded-full border border-border bg-muted/40 px-5 py-2.5 text-sm outline-none focus:border-primary"/></form></div>

            <div className="flex-1 md:hidden" />

            {/* Action icons */}
            <div className="flex items-center gap-0.5"><Link href="/products" className="rounded-full p-2 hover:bg-muted" aria-label="Sök produkter"><Search className="h-5 w-5"/></Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="border-t border-border py-3 md:hidden">
              <form action="/products"><input name="q" aria-label="Sök produkter" placeholder="Sök momentnyckel..." className="w-full rounded-lg border border-border bg-background px-4 py-2.5"/></form>
            </div>
          )}
        </div>

        {/* Mobile navigation sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border px-4 py-4">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Ember
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4" aria-label="Mobilmeny"><Link href="/products" className="p-3" onClick={()=>setMobileMenuOpen(false)}>Alla produkter</Link><Link href="/#valjare" className="p-3" onClick={()=>setMobileMenuOpen(false)}>Produktväljare</Link><Link href="/#kategorier" className="p-3" onClick={()=>setMobileMenuOpen(false)}>Kategorier</Link><Link href="/#guide" className="p-3" onClick={()=>setMobileMenuOpen(false)}>Köpguide</Link></nav>
          </SheetContent>
        </Sheet>

        
      </header>
    </>
  )
}
