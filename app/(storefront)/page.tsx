import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HeroBanner } from "@/components/storefront/hero-banner"
import { CategoryGrid } from "@/components/storefront/category-grid"
import { MomentFinder } from "@/components/moment-finder"
import { getCatalog } from "@/lib/adtraction"

export const revalidate = 21600

function SectionHeader({title,href,label}:{title:string,href?:string,label?:string}) {
 return <div className="mb-6 flex items-end justify-between gap-4"><h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>{href&&<Link href={href} className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">{label || "Visa alla"} <ArrowRight className="size-4"/></Link>}</div>
}

export default async function HomePage(){
 const products=await getCatalog()
 return <div className="flex flex-col">
  <HeroBanner/>
  <section id="kategorier" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
   <SectionHeader title="Handla efter användningsområde" href="/products" label="Utforska alla"/>
   <CategoryGrid/>
  </section>
  <section id="valjare" className="border-y border-border bg-muted/30 py-12 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
   <SectionHeader title="Produktväljaren" href="/products" label="Öppna hela katalogen"/>
   <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">Filtrera momentnycklar efter användningsområde, budget och egenskaper. Köpknappar tar dig direkt till återförsäljaren.</p>
   <MomentFinder products={products}/>
  </div></section>
  <section id="guide" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8"><SectionHeader title="Guide: Välj rätt momentnyckel"/>
   <div className="grid gap-4 sm:grid-cols-3">{[
    ["Momentområde (Nm)","Nyckelns arbetsområde ska täcka det åtdragningsmoment som specificeras för komponenten."],
    ["Fyrkantsfäste","Kontrollera dimensioner som 1/4, 3/8 och 1/2 tum samt kompatibla hylsor."],
    ["Precision och kvalitet","Välj noggrannhet, material och kalibreringsmöjlighet efter hur verktyget ska användas."]
   ].map(x=><article key={x[0]} className="border border-border bg-card p-6"><h3 className="font-heading text-lg font-semibold">{x[0]}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{x[1]}</p></article>)}</div>
  </section>
 </div>
}