"use client"
import Link from "next/link"
import {useEffect,useState} from "react"
import {Search,Heart,Scale,Menu,X,ChevronDown} from "lucide-react"

function Brand(){return <Link href="/" aria-label="MN – startsida" className="flex shrink-0 items-center gap-2.5 text-white">
 <svg viewBox="0 0 58 58" role="img" aria-label="MN-logotyp" className="h-10 w-10 md:h-12 md:w-12">
  <defs><linearGradient id="mnmetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff"/><stop offset=".7" stopColor="#c5cbd4"/><stop offset="1" stopColor="#e5ad4f"/></linearGradient></defs>
  <path d="M49 12A24 24 0 1 0 51 38" fill="none" stroke="url(#mnmetal)" strokeWidth="4.5" strokeLinecap="round"/>
  <path d="M16 39V20l10 12V20M31 39V20l8 12 8-12v19" stroke="#fff" fill="none" strokeWidth="3.9" strokeLinejoin="round" strokeLinecap="round"/>
  <path d="M11 45q15 7 30-1" fill="none" stroke="#e7ae46" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <span className="font-heading text-3xl font-black italic tracking-tighter md:text-4xl">MN</span>
 </Link>}
const menus=[
 {title:"Momentnycklar",href:"/products",links:[["Alla momentnycklar","/products"],["Digitala","/products?type=digital"],["Klickmomentnycklar","/products?type=klick"],["Precisionsverktyg","/products?use=precision"]]},
 {title:"Tillbehör",href:"/products?type=tillbehor",links:[["Momentadaptrar","/products?type=tillbehor"],["Momentmejslar","/products?type=mejsel"],["Momentnyckelset","/products?type=set"]]},
 {title:"Märken",href:"/products",links:[["Alla märken","/products"]]},
 {title:"Användningsområden",href:"/#kategorier",links:[["Bil & hjul","/products?use=bil"],["Cykel","/products?use=cykel"],["Motorcykel","/products?use=mc"],["Industri & verkstad","/products?use=verkstad"]]},
]
export function StoreHeader(){
 const [menuOpen,setMenuOpen]=useState(false)
 const [counts,setCounts]=useState({f:0,c:0})
 useEffect(()=>{
  const refresh=()=>{try{setCounts({f:JSON.parse(localStorage.getItem("mn-favorites")||"[]").length,c:JSON.parse(localStorage.getItem("mn-compare")||"[]").length})}catch{setCounts({f:0,c:0})}}
  refresh();window.addEventListener("mn:updated",refresh);window.addEventListener("storage",refresh)
  return()=>{window.removeEventListener("mn:updated",refresh);window.removeEventListener("storage",refresh)}
 },[])
 return <header className="sticky top-0 z-50 shadow-sm">
  <div className="mn-dark border-b border-white/10">
   <div className="mx-auto flex h-[76px] max-w-[1500px] items-center gap-5 px-4 md:h-[86px] md:px-7">
    <Brand/>
    <form action="/products" className="relative mx-auto hidden w-full max-w-[560px] lg:block">
     <input name="q" className="h-12 w-full rounded-xl border border-white/20 bg-white px-5 pr-12 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-amber-400" placeholder="Sök momentnycklar, märken eller modeller…" aria-label="Sök produkter"/>
     <button aria-label="Sök" type="submit" className="absolute right-4 top-3.5 text-slate-800"><Search className="size-5"/></button>
    </form>
    <div className="ml-auto flex items-center gap-1.5 sm:gap-4">
     <Link href="/products?compare=1" className="hidden items-center gap-2 text-sm font-medium text-white/90 hover:text-amber-300 sm:flex"><Scale className="size-5"/> Jämför ({counts.c})</Link>
     <Link href="/products?favorites=1" className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-amber-300"><Heart className="size-5"/><span className="hidden sm:block">Favoriter ({counts.f})</span></Link>
     <button className="rounded-lg p-2 text-white lg:hidden" aria-label="Öppna meny" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X/>:<Menu/>}</button>
    </div>
   </div>
  </div>
  <div className="border-b border-slate-200 bg-white">
   <nav aria-label="Huvudmeny" className="mx-auto hidden h-[52px] max-w-[1500px] items-center gap-7 px-7 lg:flex">
    {menus.map(m=><div key={m.title} className="group relative flex h-full items-center">
      <Link href={m.href} className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-amber-700">{m.title}<ChevronDown className="size-3.5"/></Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-60 rounded-b-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">{m.links.map(l=><Link key={l[1]} href={l[1]} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100">{l[0]}</Link>)}</div>
    </div>)}
    <Link href="/#guide" className="text-sm font-semibold text-slate-900 hover:text-amber-700">Guider & tips</Link>
   </nav>
   <form action="/products" className="mx-auto flex max-w-[1500px] gap-2 p-3 lg:hidden"><input name="q" placeholder="Sök momentnycklar..." className="mn-field flex-1"/><button className="rounded-xl bg-[#12243a] px-4 text-white" aria-label="Sök"><Search/></button></form>
   {menuOpen&&<nav className="border-t border-slate-100 p-3 lg:hidden">{menus.map(m=><Link onClick={()=>setMenuOpen(false)} key={m.title} href={m.href} className="block rounded-lg px-4 py-3 font-medium hover:bg-slate-50">{m.title}</Link>)}<Link onClick={()=>setMenuOpen(false)} href="/#guide" className="block rounded-lg px-4 py-3 font-medium">Guider & tips</Link></nav>}
  </div>
 </header>
}
