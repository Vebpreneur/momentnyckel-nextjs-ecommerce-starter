import type {Metadata} from "next"
import Link from "next/link"
import {CatalogStore} from "@/components/catalog-store"
import {getCatalog} from "@/lib/adtraction"
export const metadata:Metadata={title:"Alla momentnycklar – katalog & produktväljare"}
export const dynamic="force-dynamic"
export default async function ProductsPage({searchParams}:{searchParams:Promise<{use?:string,q?:string,type?:string,favorites?:string,compare?:string}>}){
 const q=await searchParams
 const products=await getCatalog()
 return <div className="mx-auto max-w-[1536px] px-3 py-8 pb-20 sm:px-5">
  <nav aria-label="Brödsmulor" className="mb-6 text-xs text-slate-500"><Link href="/" className="hover:underline">Startsida</Link> / Alla produkter</nav>
  <div className="mb-7"><h1 className="font-heading text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Momentnycklar & tillbehör</h1><p className="mt-3 text-sm text-slate-600">Utforska produkter, hitta rätt arbetsområde och jämför egenskaper innan du väljer.</p></div>
  <CatalogStore products={products} initialQuery={q.q||""} initialUsage={q.use||"alla"} initialType={q.type||"alla"} initialFavorites={q.favorites==="1"} initialCompare={q.compare==="1"}/>
 </div>
}
