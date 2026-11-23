import type { CatalogProduct } from "@/lib/adtraction"
export function productSlug(p: Pick<CatalogProduct,"id"|"name">):string {
 const base=p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,72)
 let h=2166136261
 for(const c of p.id){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return base+"-"+(h>>>0).toString(36)
}
