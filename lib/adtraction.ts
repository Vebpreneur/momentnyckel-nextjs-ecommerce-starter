import "server-only"

export type CatalogProduct = {
  id: string
  name: string
  description: string
  price: number | null
  currency: string
  image: string
  trackingUrl: string
  brand: string
  category: string
  purposes: string[]
}

const API = "https://api.adtraction.net/v3"
const TOKEN = process.env.ADTRACTION_API_TOKEN
const CHANNEL = process.env.ADTRACTION_CHANNEL_ID || "2084598880"
const FEED_ID = "558"
const XML_URL = "https://secure.adtraction.com/productfeed.htm?type=feed&format=XML&encoding=UTF8&epi=0&zip=0&cdelim=tab&tdelim=singlequote&sd=0&sn=0&flat=0&apid=1514097158&asid=2084598880&gsh=1&pfid=558&gt=0"
const relevant = /momentnyck|momentmejsel|torque[\s-]*wrench|torque[\s-]*screwdriver|momentstav|momentadapter|momentverktyg/i

function str(value:unknown):string { return typeof value==="string" ? value.trim() : (typeof value==="number" ? String(value) : "") }
function usesFor(text:string):string[] {
 const u:string[]=[]
 if(/cykel|bike|bicycle|mtb|precision|finmekanik/i.test(text))u.push("cykel","precision")
 if(/bil|hjul|auto|garage|1\/2|verkstad/i.test(text))u.push("bil","verkstad")
 if(/motorcykel|motorbike|\bmc\b/i.test(text))u.push("mc")
 if(/lastbil|truck|tung|industri|3\/4/i.test(text))u.push("tung","industri")
 if(/lantbruk|traktor|maskin/i.test(text))u.push("maskin")
 return u.length?[...new Set(u)]:["allmant"]
}
function priceOf(v:unknown):number|null {
 const cleaned=typeof v==="number"?String(v):str(v).replace(/[^\d,.]/g,"").replace(",",".")
 const n=Number(cleaned)
 return Number.isFinite(n)&&n>0?n:null
}
function normalize(row:Record<string,unknown>):CatalogProduct|null {
 const name=str(row.productName)||str(row.title)||str(row.name)
 const category=str(row.productCategory)||str(row.product_type)
 if(!relevant.test(name))return null
 const trackingUrl=str(row.trackingUrl)||str(row.tracking_link)||str(row.link)
 if(!/^https?:\/\//.test(trackingUrl))return null
 if(row.inStock===false || str(row.availability).toLowerCase()==="out of stock")return null
 const description=str(row.productDescription)||str(row.description)
 const priceText=str(row.productPrice)||str(row.sale_price)||str(row.price)
 const p=priceOf(row.productPrice??row.sale_price??row.price)
 return {
  id:str(row.sku)||str(row.ean)||str(row.id)||trackingUrl,
  name, description:description.slice(0,1500),price:p,
  currency:str(row.currency)||priceText.match(/\b(SEK|EUR|USD)\b/)?.[0]||"SEK",
  image:str(row.imageUrl)||str(row.image_link),
  trackingUrl,brand:str(row.manufacturer)||str(row.brand),
  category,purposes:usesFor([name,category,description].join(" "))
 }
}
function collection(input:unknown):Record<string,unknown>[] {
 if(Array.isArray(input)) return input.filter((r):r is Record<string,unknown>=>Boolean(r)&&typeof r==="object")
 if(!input||typeof input!=="object")return []
 const o=input as Record<string,unknown>
 for(const key of ["products","data","items","results","programs","feeds"]){
  if(Array.isArray(o[key]))return collection(o[key])
 }
 return []
}
function uniqueProducts(input:unknown):CatalogProduct[]{
 const found=collection(input).map(normalize).filter((x):x is CatalogProduct=>x!==null)
 return [...new Map(found.map(x=>[x.id,x])).values()]
}
function decode(value:string):string {
 return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1")
 .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'")
 .replace(/&lt;/g,"<").replace(/&gt;/g,">")
 .replace(/&#(\d+);/g,(_,n:string)=>String.fromCodePoint(Number(n)))
 .replace(/<[^>]*>/g,"").trim()
}
function xmlField(xml:string,tag:string):string {
 const match=xml.match(new RegExp("<(?:[\\w-]+:)?"+tag+"(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w-]+:)?"+tag+">","i"))
 return match?decode(match[1]):""
}
function fromXML(xml:string):CatalogProduct[] {
 const matches=xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)||[]
 const raw=matches.map(item=>({
  id:xmlField(item,"id"), title:xmlField(item,"title"),
  description:xmlField(item,"description"), product_type:xmlField(item,"product_type"),
  link:xmlField(item,"link"), image_link:xmlField(item,"image_link"),
  price:xmlField(item,"price"),sale_price:xmlField(item,"sale_price"),
  availability:xmlField(item,"availability"),brand:xmlField(item,"brand"),
 }))
 return uniqueProducts(raw)
}
async function request(path:string,method:"GET"|"POST"="GET",body?:unknown):Promise<unknown> {
 if(!TOKEN)return null
 const response=await fetch(API+path,{
  method,
  headers:{"X-Token":TOKEN,"Accept":"application/json","Content-Type":"application/json"},
  ...(body?{body:JSON.stringify(body)}:{}),
  next:{revalidate:21600},
  signal:AbortSignal.timeout(25000)
 })
 console.info("[Adtraction]",path.replace(/\d{7,}/g,"ID"),"HTTP",response.status)
 if(!response.ok)return null
 return response.json()
}
async function discoverProgram():Promise<string|null> {
 const result=await request("/partner/programs/","POST",{market:"SE"})
 const candidates=collection(result)
 console.info("[Adtraction] programs returned:",candidates.length)
 const candidate=candidates.find(p=>/cs[\s-]*mega[\s-]*store/i.test([p.name,p.programName,p.title,p.companyName].map(str).join(" ")))
 return candidate ? str(candidate.programId)||str(candidate.id) : null
}
async function getApiProducts():Promise<CatalogProduct[]>{
 if(!TOKEN)return []
 const program=await discoverProgram()
 if(!program)return []
 const info=await request("/partner/products/feedinfo/"+encodeURIComponent(program)+"/"+encodeURIComponent(CHANNEL)+"/")
 const feeds=collection(info)
 console.info("[Adtraction] CS MEGASTORE feed info count:",feeds.length)
 const feed=feeds.find(x=>str(x.id)===FEED_ID)||feeds[0]
 const feedId=feed ? str(feed.id)||str(feed.feedId) : FEED_ID
 const attempts=[
  "/partner/products/feed/"+encodeURIComponent(program)+"/"+encodeURIComponent(CHANNEL)+"/?feedId="+encodeURIComponent(feedId),
  "/partner/products/feed/"+encodeURIComponent(program)+"/"+encodeURIComponent(CHANNEL)+"/"+encodeURIComponent(feedId)+"/",
  "/partner/products/feed/"+encodeURIComponent(program)+"/"+encodeURIComponent(CHANNEL)+"/"
 ]
 for(const path of attempts) {
  const data=await request(path)
  const result=uniqueProducts(data)
  if(result.length) return result
 }
 return []
}
export function productSlug(p:CatalogProduct):string {
 const base=p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,72)
 let h=2166136261
 for(const c of p.id){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return base+"-"+(h>>>0).toString(36)
}
export async function getCatalog():Promise<CatalogProduct[]> {
 try {
  const apiProducts=await getApiProducts()
  if(apiProducts.length){console.info("[Adtraction] relevant products:",apiProducts.length);return apiProducts}
 } catch(e){console.error("[Adtraction] API:",e instanceof Error?e.message:"unexpected")}
 try{
  const response=await fetch(XML_URL,{next:{revalidate:21600},signal:AbortSignal.timeout(25000)})
  console.info("[Adtraction] XML feed HTTP",response.status)
  if(response.ok){
   const products=fromXML(await response.text())
   console.info("[Adtraction] relevant XML products:",products.length)
   return products
  }
 }catch(e){console.error("[Adtraction] XML:",e instanceof Error?e.message:"unexpected")}
 return []
}
