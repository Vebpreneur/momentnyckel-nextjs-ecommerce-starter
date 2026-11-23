import Link from "next/link"
import type { ReactNode } from "react"
export default function StorefrontLayout({ children }: { children: ReactNode }) {
 return <div className="min-h-screen bg-[#f8f9fb] text-slate-950">
  <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
   <div className="mx-auto flex h-17 max-w-7xl items-center justify-between gap-4 px-5">
    <Link href="/" className="text-xl font-extrabold tracking-tight">momentnyckel<span className="text-amber-600">.se</span></Link>
    <nav className="flex items-center gap-4 text-sm font-medium sm:gap-7"><Link href="/#produkter">Produkter</Link><Link href="/#guide">Köpguide</Link></nav>
   </div>
  </header>
  <main>{children}</main>
  <footer className="border-t border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-3 px-5 py-10 text-sm text-slate-600 sm:grid-cols-2"><div><p className="font-bold text-slate-900">momentnyckel.se</p><p className="mt-1">Hitta rätt momentnyckel för ditt arbete.</p></div><p className="sm:text-right">Priser och tillgänglighet kan ändras hos återförsäljaren. Vissa länkar kan ge ersättning.</p></div></footer>
 </div>
}