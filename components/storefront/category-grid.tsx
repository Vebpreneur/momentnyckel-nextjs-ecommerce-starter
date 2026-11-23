import Link from "next/link"
import { Wrench, Bike, CarFront, Cog, Gauge, Truck, Settings, Hammer } from "lucide-react"
const items=[
 {slug:"bil",name:"Bil & hjulbyte",Icon:CarFront},{slug:"cykel",name:"Cykel",Icon:Bike},
 {slug:"mc",name:"Motorcykel",Icon:Gauge},{slug:"verkstad",name:"Verkstad",Icon:Wrench},
 {slug:"precision",name:"Finmekanik",Icon:Cog},{slug:"tung",name:"Tunga fordon",Icon:Truck},
 {slug:"industri",name:"Industri",Icon:Settings},{slug:"maskin",name:"Maskiner & lantbruk",Icon:Hammer},
]
export function CategoryGrid() {
 return <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">{items.map((category,i)=><Link key={category.slug} href={`/products?use=${category.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-neutral-900">
  <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-neutral-900 to-black transition-transform duration-700 group-hover:scale-105"/>
  <category.Icon className="absolute left-1/2 top-[40%] size-16 -translate-x-1/2 -translate-y-1/2 text-white/75 sm:size-20" strokeWidth={1.1}/>
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4"><p className="text-xs uppercase tracking-widest text-white/40">0{i+1}</p><h3 className="mt-1 text-sm font-semibold text-white sm:text-base">{category.name}</h3></div>
 </Link>)}</div>
}