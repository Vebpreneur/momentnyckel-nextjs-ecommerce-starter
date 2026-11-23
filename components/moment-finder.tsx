"use client"

import { useMemo, useState } from "react"
import type { CatalogProduct } from "@/lib/adtraction"
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { productSlug } from "@/lib/product-slug"

const uses = [
  ["alla","Alla användningsområden"], ["bil","Bil & hjulbyte"],
  ["cykel","Cykel"],["mc","Motorcykel"],["verkstad","Verkstad"],
  ["precision","Finmekanik"],["tung","Tunga fordon"],
  ["industri","Industri"],["maskin","Maskiner & lantbruk"],
]
export function MomentFinder({ products,initialUsage,initialQuery }: { products: CatalogProduct[], initialUsage?:string, initialQuery?:string }) {
  const [usage,setUsage] = useState(initialUsage && uses.some(x=>x[0]===initialUsage) ? initialUsage : "alla")
  const [budget,setBudget] = useState("alla")
  const [query,setQuery] = useState(initialQuery || "")
  const [sort,setSort] = useState("match")
  const [limit,setLimit] = useState(24)
  const results = useMemo(() => {
    return products.filter(p => {
      if (usage !== "alla" && !p.purposes.includes(usage) && !p.purposes.includes("allmant")) return false
      if (budget !== "alla") {
        if (p.price === null) return false
        if (budget === "under500" && p.price >= 500) return false
        if (budget === "500-1500" && (p.price < 500 || p.price >= 1500)) return false
        if (budget === "1500-3000" && (p.price < 1500 || p.price >= 3000)) return false
        if (budget === "over3000" && p.price < 3000) return false
      }
      return (p.name + " " + p.brand + " " + p.description).toLowerCase().includes(query.toLowerCase().trim())
    }).sort((a,b) => sort === "ascending" ? (a.price ?? Infinity)-(b.price ?? Infinity) :
                         sort === "descending" ? (b.price ?? -1)-(a.price ?? -1) : 0)
  }, [products,usage,budget,query,sort])
  return <div id="produkter" className="scroll-mt-28">
    <div className="mb-6 flex items-center justify-between gap-4">
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-700">Produktväljare</p><h2 className="text-3xl font-bold tracking-tight md:text-4xl">Hitta rätt momentnyckel</h2></div>
      <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">{results.length} träffar</span>
    </div>
    <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-5 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4"/> Välj efter ditt behov</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold text-slate-500">Användningsområde
          <select value={usage} onChange={e=>{setUsage(e.target.value);setLimit(24)}} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900">
            {uses.map(u=><option key={u[0]} value={u[0]}>{u[1]}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-500">Budget
          <select value={budget} onChange={e=>{setBudget(e.target.value);setLimit(24)}} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900">
            <option value="alla">Alla prisklasser</option><option value="under500">Under 500 kr</option><option value="500-1500">500–1 500 kr</option><option value="1500-3000">1 500–3 000 kr</option><option value="over3000">Över 3 000 kr</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-500">Sortera efter
          <select value={sort} onChange={e=>setSort(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900">
            <option value="match">Relevans</option><option value="ascending">Lägsta pris</option><option value="descending">Högsta pris</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-500">Sök produkt
          <span className="relative mt-2 block"><Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Märke, Nm, modell..." className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 text-sm text-slate-900"/></span>
        </label>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">Kontrollera alltid att verktygets momentområde och fäste passar ditt arbete. Automatiska kategoriförslag är vägledande.</p>
    </div>
    {products.length === 0 ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-10 text-center"><h3 className="text-lg font-semibold">Produktkatalogen förbereds</h3><p className="mt-2 text-sm text-slate-600">Vi visar inga exempelpriser eller påhittade produkter. Katalogen fylls med verkliga produkter när Adtraction-importen är ansluten.</p></div> :
     results.length === 0 ? <div className="rounded-2xl border bg-white p-10 text-center"><p className="font-semibold">Inga produkter matchar filtren.</p><button className="mt-3 text-sm font-semibold underline" onClick={()=>{setUsage("alla");setBudget("alla");setQuery("")}}>Visa alla produkter</button></div> :
     <><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
       {results.slice(0,limit).map(p=><Card key={p.id} className="group overflow-hidden rounded-none border-border bg-card py-0 transition-shadow hover:shadow-lg">
         <Link href={`/products/${productSlug(p)}`} className="relative flex aspect-[3/4] items-center justify-center bg-muted p-4">
           {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain"/>:<span className="text-sm text-slate-400">Produktbild saknas</span>}
         </Link><CardContent className="flex flex-1 flex-col px-3 py-4">
           <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{p.brand || "Momentnyckel"}</p>
           <Link href={`/products/${productSlug(p)}`} className="hover:text-primary"><h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-foreground">{p.name}</h3></Link>
           <div className="mt-auto pt-4"><p className="mb-3 text-base font-bold">{p.price === null ? "Se pris hos butiken" : new Intl.NumberFormat("sv-SE",{style:"currency",currency:p.currency}).format(p.price)}</p>
           <a href={p.trackingUrl} rel="sponsored nofollow noopener noreferrer" target="_blank" className="flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2.5 text-xs font-semibold text-background hover:opacity-80">Se hos butik <ArrowUpRight className="h-4 w-4"/></a></div></CardContent></Card>)}
     </div>{limit < results.length && <div className="mt-8 text-center"><button onClick={()=>setLimit(x=>x+48)} className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold">Visa fler produkter</button></div>}</>}
  </div>
}
