import {HeroBanner} from "@/components/storefront/hero-banner"
import {CatalogStore} from "@/components/catalog-store"
import {CategoryGrid} from "@/components/storefront/category-grid"
import {getCatalog} from "@/lib/adtraction"
import {Gauge,ShieldCheck,Wrench} from "lucide-react"
import Link from "next/link"
export const dynamic="force-dynamic"
export default async function HomePage(){
 const products=await getCatalog()
 return <div className="bg-[#f8f9fa] pb-16">
  <HeroBanner/>
  <section className="mx-auto max-w-[1536px] px-3 pt-5 sm:px-5 sm:pt-7"><CatalogStore products={products} home/></section>
  <section id="kategorier" className="mx-auto max-w-[1536px] scroll-mt-40 px-3 pt-20 sm:px-5">
   <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700">Utforska sortimentet</p><h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">Momentnycklar för varje användning</h2></div><Link href="/products" className="text-sm font-bold text-amber-800 hover:underline">Visa alla produkter</Link></div>
   <CategoryGrid/>
  </section>
  <section id="guide" className="mx-auto max-w-[1536px] scroll-mt-40 px-3 pt-20 sm:px-5">
   <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700">Köpguide</p><h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">Välj rätt momentnyckel</h2>
   <div className="mt-7 grid gap-4 md:grid-cols-3">
    {[
     {Icon:Gauge,title:"Momentområde (Nm)",text:"Välj ett verktyg vars specificerade arbetsområde täcker de åtdragningsmoment du använder. Kontrollera alltid tillverkarens uppgifter."},
     {Icon:Wrench,title:"Fäste och användning",text:"Kontrollera dimensionen på fyrkantsfästet, tillgängliga hylsor och om verktyget passar i arbetsutrymmet."},
     {Icon:ShieldCheck,title:"Precision och kvalitet",text:"För känslig montering är precision och noggrannhet viktigt. Överväg även kalibreringsmöjlighet och kvalitet."}
    ].map(x=><article key={x.title} className="rounded-xl border border-slate-200 bg-white p-7"><x.Icon className="size-7 text-amber-700"/><h3 className="mt-5 font-heading text-xl font-bold">{x.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{x.text}</p></article>)}
   </div>
  </section>
 </div>
}
