"use client"
import Link from "next/link"
import {useEffect,useMemo,useState} from "react"
import {ArrowUpRight,ChevronDown,Heart,Search,SlidersHorizontal,Scale,Check,X} from "lucide-react"
import type {CatalogProduct} from "@/lib/adtraction"
import {productSlug} from "@/lib/product-slug"

export function money(value:number|null,currency:string){
 if(value===null)return "Se pris på produktsidan"
 try{return new Intl.NumberFormat("sv-SE",{style:"currency",currency,maximumFractionDigits:0}).format(value)}
 catch{return value.toLocaleString("sv-SE")+" kr"}
}
const uses=[["alla","Alla områden"],["bil","Bil & hjulbyte"],["cykel","Cykel"],["mc","Motorcykel"],["verkstad","Verkstad"],["precision","Precision"],["tung","Tunga fordon"],["industri","Industri"],["maskin","Maskiner & lantbruk"]]
const nmOptions=[["alla","Alla momentområden"],["0-20","0–20 Nm"],["20-100","20–100 Nm"],["100-200","100–200 Nm"],["200+","Över 200 Nm"]]
const driveOptions=[["alla","Alla fästen"],["1/4",'1/4"'],["3/8",'3/8"'],["1/2",'1/2"'],["3/4",'3/4"']]
const budgetOptions=[["alla","Alla priser"],["under500","Under 500 kr"],["500-1500","500–1 500 kr"],["1500-3000","1 500–3 000 kr"],["over3000","Över 3 000 kr"]]
const kindOptions=[["alla","Alla typer"],["standard","Momentnycklar"],["digital","Digitala"],["klick","Klickmomentnycklar"],["set","Satser & set"],["mejsel","Momentmejslar"],["tillbehor","Tillbehör"]]
const selectBase="mn-field cursor-pointer"
function fromStorage(key:string){try{const v=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(v)?v.filter((x):x is string=>typeof x==="string"):[]}catch{return []}}
function shareStorage(key:string,items:string[]){try{localStorage.setItem(key,JSON.stringify(items));window.dispatchEvent(new Event("mn:updated"))}catch{}}
function overlapsNm(p:CatalogProduct,nm:string){
 if(nm==="alla")return true
 if(p.nmMin===null&&p.nmMax===null)return false
 const min=p.nmMin??0,max=p.nmMax??Infinity
 const low=nm==="0-20"?0:nm==="20-100"?20:nm==="100-200"?100:200
 const high=nm==="0-20"?20:nm==="20-100"?100:nm==="100-200"?200:Infinity
 return min<=high&&max>=low
}
function withinBudget(p:CatalogProduct,v:string){
 if(v==="alla")return true
 const n=p.price;if(n===null)return false
 return v==="under500"?n<500:v==="500-1500"?n>=500&&n<1500:v==="1500-3000"?n>=1500&&n<3000:n>=3000
}
function SelectBox({title,value,onChange,options,light=false}:{title:string,value:string,onChange:(s:string)=>void,options:string[][],light?:boolean}){
 return <label className="block min-w-0"><span className={"mb-2 block text-xs font-semibold "+(light?"text-slate-600":"text-slate-200")}>{title}</span><select className={selectBase} value={value} onChange={e=>onChange(e.target.value)}>{options.map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label>
}
function ProductCard({p,favorite,compared,onFavorite,onCompare}:{p:CatalogProduct,favorite:boolean,compared:boolean,onFavorite:()=>void,onCompare:()=>void}){
 const href="/products/"+productSlug(p)
 return <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
  <div className="mn-card-image relative aspect-[4/4] overflow-hidden">
   <Link href={href} aria-label={"Visa "+p.name} className="flex h-full w-full items-center justify-center p-4">
    {p.image?<img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"/>:<span className="text-xs text-slate-400">Produktbild saknas</span>}
   </Link>
   <button type="button" onClick={onFavorite} aria-label={favorite?"Ta bort favorit":"Spara favorit"} className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:text-amber-700"><Heart className={"size-4 "+(favorite?"fill-amber-400 text-amber-600":"")}/></button>
   {p.kind==="digital"&&<span className="absolute left-3 top-3 rounded-md bg-[#152a41] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Digital</span>}
  </div>
  <div className="flex flex-1 flex-col p-4">
   <p className="mb-1.5 line-clamp-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{p.brand||"Momentverktyg"}</p>
   <Link href={href} className="text-sm font-semibold leading-snug text-slate-900 hover:text-amber-800"><h3 className="line-clamp-2 min-h-10">{p.name}</h3></Link>
   <p className="mt-2 min-h-5 text-xs text-slate-500">{[p.drive?p.drive+' tum':"",p.nmMax!==null?(p.nmMin===null?"Upp till "+p.nmMax+" Nm":p.nmMin+"–"+p.nmMax+" Nm"):""].filter(Boolean).join(" · ")||p.category||"Momentnyckel"}</p>
   <div className="mt-auto pt-4"><div className="mb-3 flex items-baseline gap-2"><strong className="text-xl font-bold tracking-tight text-slate-950">{money(p.price,p.currency)}</strong>{p.oldPrice!==null&&p.price!==null&&p.oldPrice>p.price&&<del className="text-xs text-slate-400">{money(p.oldPrice,p.currency)}</del>}</div>
   <Link href={href} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#11263d] px-3 text-sm font-semibold text-white transition hover:bg-[#203a57]">Se produkt <ArrowUpRight className="size-4"/></Link>
   <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={compared} onChange={onCompare} className="accent-amber-600"/> Jämför produkt</label></div>
  </div>
 </article>
}
export function CatalogStore({products,initialUsage="alla",initialQuery="",initialType="alla",initialFavorites=false,initialCompare=false,home=false}:{products:CatalogProduct[],initialUsage?:string,initialQuery?:string,initialType?:string,initialFavorites?:boolean,initialCompare?:boolean,home?:boolean}){
 const [usage,setUsage]=useState(initialUsage)
 const [nm,setNm]=useState("alla")
 const [drive,setDrive]=useState("alla")
 const [budget,setBudget]=useState("alla")
 const [kind,setKind]=useState(initialType)
 const [query,setQuery]=useState(initialQuery)
 const [sort,setSort]=useState("default")
 const [limit,setLimit]=useState(home?24:36)
 const [favoritesOnly,setFavoritesOnly]=useState(initialFavorites)
 const [compareOnly,setCompareOnly]=useState(initialCompare)
 const [favorites,setFavorites]=useState<string[]>([])
 const [compare,setCompare]=useState<string[]>([])
 const [showCompare,setShowCompare]=useState(false)
 const [filterOpen,setFilterOpen]=useState(false)
 useEffect(()=>{setFavorites(fromStorage("mn-favorites"));setCompare(fromStorage("mn-compare"))},[])
 const setFav=(id:string)=>setFavorites(old=>{const next=old.includes(id)?old.filter(x=>x!==id):[...old,id];shareStorage("mn-favorites",next);return next})
 const setComp=(id:string)=>setCompare(old=>{const next=old.includes(id)?old.filter(x=>x!==id):old.length>=4?old:[...old,id];shareStorage("mn-compare",next);return next})
 const filtered=useMemo(()=>products.filter(p=>{
  if(usage!=="alla"&&!p.purposes.includes(usage)&&!p.purposes.includes("allmant"))return false
  if(!overlapsNm(p,nm)||drive!=="alla"&&p.drive!==drive||!withinBudget(p,budget))return false
  if(kind!=="alla"&&p.kind!==kind)return false
  if(favoritesOnly&&!favorites.includes(p.id)||compareOnly&&!compare.includes(p.id))return false
  const q=query.trim().toLocaleLowerCase("sv")
  return !q||[p.name,p.brand,p.description,p.sku,p.category].join(" ").toLocaleLowerCase("sv").includes(q)
 }).sort((a,b)=>sort==="asc"?(a.price??Infinity)-(b.price??Infinity):sort==="desc"?(b.price??-1)-(a.price??-1):a.name.localeCompare(b.name,"sv")),[products,usage,nm,drive,budget,kind,query,sort,favoritesOnly,favorites,compareOnly,compare])
 const comparedProducts=products.filter(p=>compare.includes(p.id))
 const clear=()=>{setUsage("alla");setNm("alla");setDrive("alla");setBudget("alla");setKind("alla");setQuery("");setFavoritesOnly(false);setCompareOnly(false)}
 return <div id="valjare" className="scroll-mt-36">
  <div className="rounded-2xl border border-[#304154] bg-[#0f2032] p-5 shadow-lg sm:p-7">
   <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Produktväljare <span className="text-amber-400">–</span> hitta rätt momentnyckel</h2><span className="text-xs text-slate-300">Anpassa efter dina behov</span></div>
   <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
    <SelectBox title="Användningsområde" value={usage} onChange={setUsage} options={uses}/>
    <SelectBox title="Momentområde (Nm)" value={nm} onChange={setNm} options={nmOptions}/>
    <SelectBox title="Fäste (tum)" value={drive} onChange={setDrive} options={driveOptions}/>
    <SelectBox title="Pris" value={budget} onChange={setBudget} options={budgetOptions}/>
    <a href="#produktlista" className="mn-gold-bg mt-auto flex min-h-[50px] items-center justify-center gap-2 rounded-lg text-sm font-bold text-[#101827] hover:brightness-110"><Search className="size-4"/> Visa produkter</a>
   </div>
  </div>
  <div id="produktlista" className="mt-7 scroll-mt-36">
   <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700">Produktkatalog</p><h2 className="mt-1 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Utforska momentnycklar</h2></div>
    <p className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">{filtered.length} produkter</p>
   </div>
   <div className="mb-4 flex gap-2 lg:hidden"><button onClick={()=>setFilterOpen(v=>!v)} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold"><SlidersHorizontal className="size-4"/> Filtrera <ChevronDown className="size-4"/></button></div>
   <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
    <aside className={(filterOpen?"block":"hidden")+" self-start rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-40 lg:block"}>
     <div className="mb-5 flex items-center justify-between"><h3 className="font-heading text-lg font-bold">Filtrera produkter</h3><button onClick={clear} className="text-xs font-medium text-amber-700 hover:underline">Rensa</button></div>
     <div className="space-y-5">
      <SelectBox light title="Typ av momentverktyg" value={kind} onChange={setKind} options={kindOptions}/>
      <SelectBox light title="Användningsområde" value={usage} onChange={setUsage} options={uses}/>
      <SelectBox light title="Momentområde (Nm)" value={nm} onChange={setNm} options={nmOptions}/>
      <SelectBox light title="Fäste (tum)" value={drive} onChange={setDrive} options={driveOptions}/>
      <SelectBox light title="Prisintervall" value={budget} onChange={setBudget} options={budgetOptions}/>
      <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="accent-amber-600" checked={favoritesOnly} onChange={e=>setFavoritesOnly(e.target.checked)}/> Visa favoriter</label>
      <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="accent-amber-600" checked={compareOnly} onChange={e=>setCompareOnly(e.target.checked)}/> Visa jämförda</label>
     </div>
    </aside>
    <div className="min-w-0">
     <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <label className="relative min-w-[180px] flex-1"><Search className="absolute left-3 top-3.5 size-4 text-slate-500"/><input className="mn-field pl-10" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök märke, modell, Nm eller artikelnummer..." aria-label="Sök i produktkatalogen"/></label>
      <label className="flex items-center gap-2 text-sm text-slate-600">Sortera: <select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950"><option value="default">Namn</option><option value="asc">Lägsta pris</option><option value="desc">Högsta pris</option></select></label>
     </div>
     {filtered.length>0?<div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">{filtered.slice(0,limit).map(p=><ProductCard key={p.id} p={p} favorite={favorites.includes(p.id)} compared={compare.includes(p.id)} onFavorite={()=>setFav(p.id)} onCompare={()=>setComp(p.id)}/>)}</div>:
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center"><h3 className="font-heading text-xl font-bold">{products.length===0?"Produktkatalogen laddas in":"Inga matchande produkter"}</h3><p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">{products.length===0?"Produktinformationen från leverantörens feed är ännu inte tillgänglig. Inga exempelprodukter eller påhittade priser visas.":"Prova att ändra eller rensa filtren för att se fler produkter."}</p>{products.length>0&&<button onClick={clear} className="mt-5 rounded-lg bg-[#14283d] px-5 py-2.5 text-sm font-semibold text-white">Rensa filter</button>}</div>}
     {filtered.length>limit&&<div className="mt-8 text-center"><button onClick={()=>setLimit(n=>n+48)} className="rounded-lg border border-slate-300 bg-white px-8 py-3 text-sm font-semibold hover:bg-slate-50">Visa fler produkter</button></div>}
    </div>
   </div>
  </div>
  {compare.length>0&&<div className="fixed bottom-4 left-1/2 z-40 flex w-[min(94vw,640px)] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-[#0d2033] px-5 py-3 text-sm text-white shadow-2xl"><span className="flex items-center gap-2"><Scale className="size-5 text-amber-400"/> {compare.length} av 4 valda</span><div className="flex items-center gap-3"><button disabled={compare.length<2} onClick={()=>setShowCompare(true)} className="rounded-lg bg-amber-400 px-4 py-2 font-bold text-slate-950 disabled:opacity-50">Jämför</button><button aria-label="Rensa jämförelse" onClick={()=>{setCompare([]);shareStorage("mn-compare",[])}}><X className="size-5"/></button></div></div>}
  {showCompare&&<div role="dialog" aria-modal="true" aria-label="Jämför momentnycklar" className="fixed inset-0 z-[70] overflow-auto bg-slate-950/70 p-3 sm:p-8"><div className="mx-auto max-w-6xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8"><div className="mb-6 flex justify-between gap-4"><h2 className="font-heading text-2xl font-bold">Jämför momentnycklar</h2><button onClick={()=>setShowCompare(false)} aria-label="Stäng jämförelse"><X/></button></div>
   <div className="overflow-x-auto"><table className="min-w-[550px] w-full text-left text-sm"><thead><tr><th className="border-b p-3">Egenskap</th>{comparedProducts.map(p=><th key={p.id} className="min-w-40 border-b p-3"><Link className="font-semibold text-slate-900 hover:underline" href={"/products/"+productSlug(p)}>{p.name}</Link></th>)}</tr></thead><tbody>{[["Pris",(p:CatalogProduct)=>money(p.price,p.currency)],["Märke",(p:CatalogProduct)=>p.brand||"Ej angivet"],["Momentområde",(p:CatalogProduct)=>p.nmMax!==null?(p.nmMin??0)+"–"+p.nmMax+" Nm":"Ej angivet"],["Fäste",(p:CatalogProduct)=>p.drive?p.drive+" tum":"Ej angivet"],["Artikelnummer",(p:CatalogProduct)=>p.sku||"Ej angivet"]].map(([label,fn])=><tr key={String(label)}><th className="border-b p-3 font-medium">{String(label)}</th>{comparedProducts.map(p=><td key={p.id} className="border-b p-3">{(fn as (p:CatalogProduct)=>string)(p)}</td>)}</tr>)}</tbody></table></div>
  </div></div>}
 </div>
}
