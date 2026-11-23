import Link from "next/link"
import {ArrowRight,CheckCircle2,Layers,ShieldCheck} from "lucide-react"
export function HeroBanner(){return <section className="mx-auto max-w-[1536px] px-3 pt-4 sm:px-5 sm:pt-6">
 <div className="mn-hero relative flex min-h-[600px] items-center overflow-hidden rounded-2xl border border-white/10 shadow-xl sm:min-h-[670px] lg:min-h-[705px]">
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09131f]/50 via-transparent to-[#09131f]/20"/>
  <div className="relative z-10 w-full max-w-[760px] px-7 py-20 sm:px-12 sm:py-28 lg:px-20">
   <div className="mb-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[.23em] text-slate-200 sm:text-sm"><span className="h-[2px] w-12 bg-amber-400"/> Momentnycklar & verktyg</div>
   <h1 className="max-w-[680px] font-heading text-[clamp(2.6rem,4.8vw,4.9rem)] font-bold leading-[1.11] tracking-tight text-white">Hitta rätt momentnyckel <span className="block">för ditt behov</span></h1>
   <p className="mt-7 max-w-[510px] text-base leading-relaxed text-slate-200 sm:text-xl">Jämför modeller, egenskaper och priser – och hitta momentnyckeln som passar dig.</p>
   <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-100"><span className="flex items-center gap-2"><ShieldCheck className="size-5 text-amber-400"/> Rätt användningsområde</span><span className="flex items-center gap-2"><Layers className="size-5 text-amber-400"/> Flera modeller</span><span className="flex items-center gap-2"><CheckCircle2 className="size-5 text-amber-400"/> Jämför egenskaper</span></div>
   <div className="mt-12 flex flex-wrap items-center gap-4"><Link href="/#valjare" className="mn-gold-bg inline-flex min-h-14 items-center gap-3 rounded-full px-8 text-base font-bold text-slate-950 shadow-lg transition hover:brightness-110">Utforska sortimentet <ArrowRight className="size-5"/></Link><Link href="/#guide" className="inline-flex min-h-14 items-center px-4 font-medium text-white hover:text-amber-300">Guider & tips</Link></div>
  </div>
 </div>
 </section>}
