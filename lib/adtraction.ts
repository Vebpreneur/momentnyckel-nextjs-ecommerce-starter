import "server-only"
import catalog from "@/data/mn-products.json"

export type CatalogProduct={
 id:string; name:string; description:string; price:number|null; oldPrice:number|null;
 currency:string; image:string; trackingUrl:string; brand:string; category:string;
 purposes:string[]; sku:string; ean:string; nmMin:number|null; nmMax:number|null;
 drive:string; kind:string; available:boolean
}
/**
 * Reliable local product snapshot imported from Adtraction's Google Shopping feed.
 * Keeps real product cards visible even when the upstream API is throttled (429).
 * Refresh the snapshot as one atomic update when a new feed has been downloaded.
 */
const products:CatalogProduct[]=catalog as CatalogProduct[]
export async function getCatalog():Promise<CatalogProduct[]>{return products}
