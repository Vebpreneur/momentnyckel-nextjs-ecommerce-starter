import Link from "next/link"
import type {Metadata} from "next"
import {notFound} from "next/navigation"
import {ArrowUpRight,CheckCircle2,ChevronRight,ShieldCheck} from "lucide-react"
import {ProductGallery} from "@/components/storefront/product-gallery"
import {CatalogProductActions} from "@/components/catalog-product-actions"
import {getCatalog,type CatalogProduct} from "@/lib/adtraction"
import {productSlug} from "@/lib/product-slug"
import {money} from "@/lib/catalog-format"
export const dynamic="force-dynamic"
type Props={params:Promise<{slug:string}>}
async function find(slug:string){const products=await getCatalog();return {product:products.find(p=>productSlug(p)===slug),products}}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const {product}=await find(slug)
 return {title:product?.name||"Produkt",description:product?.description.slice(0,160)||"Jämför momentnycklar och läs produktinformation."}
}
function Fact({title,value}:{title:string,value:string}){return <div className="flex justify-between gap-6 border-b border-slate-200 py-3 text-sm"><dt className="font-medium text-slate-600">{title}</dt><dd className="max-w-[65%] text-right font-semibold text-slate-900">{value}</dd></div>}
export default async function ProductDetailPage({params}:Props){
 const {slug}=await params
 const {product:p,products}=await find(slug)
 if(!p)notFound()
 const title=p.name
 const related=products.filter(x=>x.id!==p.id&&(x.kind===p.kind||x.brand&&p.brand&&x.brand===p.brand)).slice(0,4)
 const nm=p.nmMax!==null?(p.nmMin!==null?p.nmMin+"–"+p.nmMax+" Nm":"Upp till "+p.nmMax+" Nm"):"Ej angivet"
 return <div className="mx-auto max-w-[1500px] px-4 py-7 pb-20 sm:px-6">
  <nav aria-label="Brödsmulor" className="mb-8 flex flex-wrap items-center gap-1 text-xs text-slate-500"><Link href="/" className="hover:underline">Startsida</Link><ChevronRight className="size-3"/><Link href="/products" className="hover:underline">Momentnycklar</Link><ChevronRight className="size-3"/><span className="line-clamp-1 text-slate-700">{title}</span></nav>
  <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
   <div className="lg:sticky lg:top-40 lg:self-start">{p.image?<ProductGallery images={[p.image]}/>:<div className="flex aspect-square items-center justify-center rounded-2xl bg-slate-100 text-slate-500">Produktbild saknas</div>}</div>
   <div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">{p.brand||"Momentnyckel"}</p>
    <h1 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
    <p className="mt-5 text-sm leading-7 text-slate-600">{p.description?p.description.slice(0,420):"Se specifikationerna och hitta rätt modell för ditt arbete."}</p>
    <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6">
     <p className="text-xs font-semibold uppercase tracking-[.2em] text-slate-500">Pris</p>
     <div className="mt-1 flex items-baseline gap-3"><strong className="text-4xl font-bold tracking-tight">{money(p.price,p.currency)}</strong>{p.oldPrice!==null&&p.price!==null&&p.oldPrice>p.price&&<del className="text-sm text-slate-400">{money(p.oldPrice,p.currency)}</del>}</div>
     <p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="size-4 text-green-600"/>Produktinformation från återförsäljaren</p>
     <a href={p.trackingUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="mn-gold-bg mt-7 flex min-h-14 items-center justify-center gap-3 rounded-xl px-5 text-base font-bold text-slate-950 hover:brightness-110">Köp produkt <ArrowUpRight className="size-5"/></a>
     <p className="mt-3 text-center text-xs text-slate-500">Köpet genomförs hos återförsäljaren. Pris och lagerstatus kan ändras.</p>
    </div>
    <div className="mt-5"><CatalogProductActions id={p.id}/></div>
    <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-heading text-xl font-bold">Tekniska uppgifter</h2><dl className="mt-4"><Fact title="Märke" value={p.brand||"Ej angivet"}/><Fact title="Momentområde" value={nm}/><Fact title="Fäste" value={p.drive?p.drive+" tum":"Ej angivet"}/><Fact title="Artikelnummer" value={p.sku||"Ej angivet"}/><Fact title="EAN" value={p.ean||"Ej angivet"}/><Fact title="Kategori" value={p.category||"Momentverktyg"}/></dl></div>
   </div>
  </div>
  <section className="mt-16 border-t border-slate-200 pt-12"><h2 className="font-heading text-2xl font-bold">Produktbeskrivning</h2><div className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-8 text-slate-700">{p.description||"Ytterligare produktbeskrivning finns hos återförsäljaren."}</div></section>
  {related.length>0&&<section className="mt-16 border-t border-slate-200 pt-12"><div className="mb-6 flex items-center justify-between"><h2 className="font-heading text-2xl font-bold">Liknande produkter</h2><Link href="/products" className="text-sm font-semibold text-amber-800 hover:underline">Se hela sortimentet</Link></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{related.map(x=><Link key={x.id} href={"/products/"+productSlug(x)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="flex aspect-square items-center justify-center bg-slate-50 p-3">{x.image?<img src={x.image} alt={x.name} loading="lazy" className="h-full w-full object-contain"/>:null}</div><div className="p-4"><h3 className="line-clamp-2 min-h-10 text-sm font-semibold group-hover:text-amber-800">{x.name}</h3><p className="mt-3 text-lg font-bold">{money(x.price,x.currency)}</p><p className="mt-2 text-xs font-semibold text-amber-800">Se produkt</p></div></Link>)}</div></section>}
  <section className="mt-12 flex flex-wrap items-center gap-3 rounded-xl bg-[#0d2033] p-6 text-sm text-white"><ShieldCheck className="size-5 text-amber-400"/><p className="flex-1">Jämför modeller och välj rätt verktyg för ditt arbete.</p><Link href="/products?compare=1" className="rounded-lg border border-white/30 px-4 py-2 font-semibold hover:bg-white/10">Öppna jämförelse</Link></section>
 </div>
}
