import Link from "next/link"
import { ArrowRight, CheckCircle2, Gauge, Wrench } from "lucide-react"
import { MomentFinder } from "@/components/moment-finder"
import { getCatalog } from "@/lib/adtraction"

export const revalidate = 21600

const useCases = [
 ["Bil & hjulbyte","Hjul, service och underhåll"],
 ["Cykel","Låga moment och känsliga komponenter"],
 ["Motorcykel","Service och montering"],
 ["Verkstad","För professionellt och återkommande arbete"],
 ["Finmekanik","Precision för mindre detaljer"],
 ["Tunga fordon","Verktyg för högre vridmoment"],
 ["Industri","Specialiserad montering"],
 ["Maskiner & lantbruk","Reparation och underhåll"],
]
export default async function HomePage() {
 const products = await getCatalog()
 return <div className="bg-[#f8f9fb] text-slate-950">
  <section className="relative overflow-hidden bg-[#101827] text-white">
   <div className="pointer-events-none absolute -right-32 -top-32 size-[500px] rounded-full bg-amber-500/10 blur-3xl"/>
   <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:py-28 lg:grid-cols-5 lg:items-center">
    <div className="lg:col-span-3">
     <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold tracking-widest text-amber-300"><Gauge className="size-4"/> MOMENTNYCKELGUIDEN</span>
     <h1 className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">Rätt momentnyckel.<span className="block text-amber-400">För rätt arbete.</span></h1>
     <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">Hitta momentnycklar för bil, cykel, motorcykel, verkstad och industri. Jämför användningsområden och prisklasser utan att leta bland hundratals irrelevanta verktyg.</p>
     <div className="mt-9 flex flex-wrap gap-3"><Link href="/#produkter" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-4 font-bold text-slate-950 hover:bg-amber-300">Hitta din momentnyckel <ArrowRight className="size-5"/></Link><Link href="/#guide" className="inline-flex items-center rounded-xl border border-white/30 px-6 py-4 font-semibold text-white hover:bg-white/10">Läs köpguiden</Link></div>
    </div>
    <div className="hidden rounded-3xl border border-white/10 bg-white/5 p-8 lg:col-span-2 lg:block">
     <div className="flex size-20 items-center justify-center rounded-2xl bg-amber-400 text-slate-950"><Wrench className="size-11"/></div>
     <h2 className="mt-8 text-2xl font-bold">Ett smartare verktygsval</h2>
     <div className="mt-6 space-y-4 text-slate-300">{["Välj rätt användningsområde","Filtrera efter budget och modell","Se verkliga produkter","Gå direkt till återförsäljaren"].map(t=><div className="flex items-center gap-3" key={t}><CheckCircle2 className="size-5 shrink-0 text-amber-400"/>{t}</div>)}</div>
    </div>
   </div>
  </section>
  <section className="mx-auto max-w-7xl px-5 py-16">
   <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-amber-700">Alla användningsområden</p><h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">En momentnyckel för varje behov</h2><p className="mt-3 text-slate-600">Från hemmagaraget till verkstaden. Börja med att välja rätt område.</p></div>
   <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">{useCases.map((item,i)=><Link href="/#produkter" key={item[0]} className="group rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:border-amber-400 hover:shadow-lg"><span className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-50 text-sm font-bold text-amber-800">{String(i+1).padStart(2,"0")}</span><h3 className="mt-5 font-bold">{item[0]}</h3><p className="mt-2 text-sm text-slate-500">{item[1]}</p><ArrowRight className="mt-5 size-4 text-amber-700"/></Link>)}</div>
  </section>
  <section className="mx-auto max-w-7xl px-5 pb-20"><MomentFinder products={products}/></section>
  <section id="guide" className="scroll-mt-24 bg-white"><div className="mx-auto max-w-7xl px-5 py-16">
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-amber-700">Köpguide</p><h2 className="mt-3 text-3xl font-bold tracking-tight">Tre saker att tänka på</h2>
   <div className="mt-8 grid gap-4 md:grid-cols-3">{[
    ["Momentområde (Nm)","Momentnyckelns arbetsområde ska omfatta det åtdragningsmoment som gäller för komponenten."],
    ["Fäste och storlek","Kontrollera verktygets fyrkantsfäste, hylsor och åtkomlighet. Vanliga storlekar är 1/4, 3/8 och 1/2 tum."],
    ["Precision och användning","För känsliga komponenter är tillräcklig noggrannhet avgörande. Vid frekvent användning kan kalibrering vara viktig."]
   ].map(item=><article className="rounded-2xl border border-slate-200 p-6" key={item[0]}><h3 className="font-bold">{item[0]}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item[1]}</p></article>)}</div>
  </div></section>
 </div>
}