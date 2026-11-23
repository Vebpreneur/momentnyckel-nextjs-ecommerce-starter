import "server-only"
import {unstable_cache} from "next/cache"

export type CatalogProduct={
 id:string;name:string;description:string;price:number|null;oldPrice:number|null;
 currency:string;image:string;trackingUrl:string;brand:string;category:string;
 purposes:string[];sku:string;ean:string;nmMin:number|null;nmMax:number|null;
 drive:string;kind:string;available:boolean
}
const API="https://api.adtraction.net/v3"
const CHANNEL=process.env.ADTRACTION_CHANNEL_ID||"2084598880"
const FEED_ID="558"
const XML_URL="https://secure.adtraction.com/productfeed.htm?type=feed&format=XML&encoding=UTF8&epi=0&zip=0&cdelim=tab&tdelim=singlequote&sd=0&sn=0&flat=0&apid=1514097158&asid=2084598880&gsh=1&pfid=558&gt=0"
const relevant=/momentnyck|momentmejsel|torque[\s-]*wrench|torque[\s-]*screwdriver|momentstav|momentadapter|momentverktyg/i
function str(v:unknown){return typeof v==="string"?v.trim():typeof v==="number"?String(v):""}
function price(v:unknown):number|null{
 if(typeof v==="number")return v>0? v:null
 let n=str(v).replace(/[^0-9,.-]/g,"").replace(/\s/g,"")
 if(n.includes(",")&&n.includes(".")){n=n.lastIndexOf(",")>n.lastIndexOf(".")?n.replace(/\./g,"").replace(",","."):n.replace(/,/g,"")}
 else if(n.includes(","))n=n.replace(",",".")
 const f=Number(n);return Number.isFinite(f)&&f>0?f:null
}
function extractNm(s:string):[number|null,number|null]{
 const m=s.match(/(\d{1,4}(?:[.,]\d+)?)\s*(?:-|–|—|till|to)\s*(\d{1,4}(?:[.,]\d+)?)\s*(?:N[\s·-]?m)\b/i)
 if(m)return [Number(m[1].replace(",",".")),Number(m[2].replace(",","."))]
 const one=s.match(/(\d{1,4}(?:[.,]\d+)?)\s*(?:N[\s·-]?m)\b/i)
 return one?[null,Number(one[1].replace(",","."))]:[null,null]
}
function typeOf(s:string):string {
 if(/adapter|förlängare|tillbehör|momentstav/i.test(s))return "tillbehor"
 if(/mejsel|screwdriver/i.test(s))return "mejsel"
 if(/set|sats|kit/i.test(s))return "set"
 if(/digital|elektronisk/i.test(s))return "digital"
 if(/klick|click/i.test(s))return "klick"
 return "standard"
}
function usesFor(s:string):string[]{
 const u:string[]=[]
 if(/cykel|bike|bicycle|mtb|precision|finmekanik/i.test(s))u.push("cykel","precision")
 if(/bil|hjul|auto|garage|1\/2|verkstad/i.test(s))u.push("bil","verkstad")
 if(/motorcykel|motorbike|\bmc\b/i.test(s))u.push("mc")
 if(/lastbil|truck|tung|industri|3\/4/i.test(s))u.push("tung","industri")
 if(/lantbruk|traktor|maskin/i.test(s))u.push("maskin")
 return u.length?[...new Set(u)]:["allmant"]
}
function objectRows(input:unknown):Record<string,unknown>[] {
 if(Array.isArray(input))return input.filter((v):v is Record<string,unknown>=>!!v&&typeof v==="object")
 if(!input||typeof input!=="object")return []
 const d=input as Record<string,unknown>
 for(const key of ["products","data","items","results","feeds","programs"]){if(Array.isArray(d[key]))return objectRows(d[key])}
 return []
}
function normal(row:Record<string,unknown>):CatalogProduct|null{
 const name=str(row.productName)||str(row.title)||str(row.name)
 if(!relevant.test(name))return null
 if(row.inStock===false || str(row.availability).toLowerCase()==="out of stock")return null
 let trackingUrl=str(row.trackingUrl)||str(row.tracking_link)||str(row.link)
 if(!/^https?:\/\//i.test(trackingUrl))return null
 // A product-feed link is accepted only if it is itself a tracking URL.
 if(!/adtr\.|adtraction\.|secure\.adtraction/i.test(new URL(trackingUrl).hostname))return null
 const description=str(row.productDescription)||str(row.description)
 const category=str(row.productCategory)||str(row.product_type)
 const sku=str(row.sku)||str(row.id)
 const ean=str(row.ean)
 const [nmMin,nmMax]=extractNm(name+" "+description.slice(0,300))
 const drive=(name+" "+description.slice(0,250)).match(/\b(1\/4|3\/8|1\/2|3\/4)\s*(?:"|tum|inch|”)/i)?.[1]||""
 const p=price(row.productPrice??row.price??row.sale_price)
 const old=price(row.oldPrice??row.old_price)
 const currency=str(row.currency)||str(row.price).match(/\b(SEK|EUR|USD)\b/)?.[0]||"SEK"
 return {id:sku||ean||trackingUrl,name,description:description.slice(0,4500),price:p,oldPrice:old,
  currency,image:str(row.imageUrl)||str(row.image_link),trackingUrl,brand:str(row.manufacturer)||str(row.brand),
  category,purposes:usesFor([name,category,description].join(" ")),sku,ean,nmMin,nmMax,
  drive,kind:typeOf(name),available:true}
}
function clean(rows:unknown):CatalogProduct[]{
 const found=objectRows(rows).map(normal).filter((p):p is CatalogProduct=>p!==null)
 return Array.from(new Map(found.map(p=>[p.id,p])).values())
}
function decode(s:string){return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#(\d+);/g,(_,n:string)=>String.fromCodePoint(Number(n))).replace(/<[^>]+>/g,"").trim()}
function field(item:string,name:string):string{
 const re=new RegExp("<(?:[a-z0-9_-]+:)?"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[a-z0-9_-]+:)?"+name+">","i")
 const m=item.match(re);return m?decode(m[1]):""
}
function parseXml(xml:string):CatalogProduct[]{
 const items=xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)||[]
 const rows=items.map(s=>({id:field(s,"id"),title:field(s,"title"),description:field(s,"description"),
  link:field(s,"link"),trackingUrl:field(s,"trackingUrl"),image_link:field(s,"image_link"),
  price:field(s,"price"),sale_price:field(s,"sale_price"),product_type:field(s,"product_type"),
  brand:field(s,"brand"),availability:field(s,"availability")}))
 return clean(rows)
}
async function fetchProductsFrom(url:string,headers?:HeadersInit):Promise<CatalogProduct[]>{
 const resp=await fetch(url,{headers,signal:AbortSignal.timeout(26000),next:{revalidate:1800}})
 console.info("[MN feed]",url.startsWith(API)?"API":"XML","HTTP",resp.status)
 if(!resp.ok)return []
 const contentType=resp.headers.get("content-type")||""
 if(contentType.includes("json"))return clean(await resp.json())
 const text=await resp.text()
 if(text.trimStart().startsWith("<"))return parseXml(text)
 try{return clean(JSON.parse(text))}catch{return []}
}
async function fetchActualCatalog():Promise<CatalogProduct[]>{
 const token=process.env.ADTRACTION_API_TOKEN
 if(token){
  const headers={"X-Token":token,Accept:"application/json","Content-Type":"application/json"}
  try {
   const progResp=await fetch(API+"/partner/programs/",{
    method:"POST",headers,body:JSON.stringify({market:"SE"}),signal:AbortSignal.timeout(12000),
    next:{revalidate:1800}
   })
   if(progResp.ok){
    const programs=objectRows(await progResp.json())
    const target=programs.find(p=>/cs[\s-]*mega[\s-]*store/i.test([p.programName,p.name,p.title,p.companyName].map(str).join(" ")))
    const programId=target?(str(target.programId)||str(target.id)):""
    if(programId){
     const infoResp=await fetch(API+"/partner/products/feedinfo/"+encodeURIComponent(programId)+"/"+encodeURIComponent(CHANNEL)+"/",{headers,signal:AbortSignal.timeout(12000),next:{revalidate:1800}})
     if(infoResp.ok){
      const feeds=objectRows(await infoResp.json())
      const chosen=feeds.find(f=>str(f.id)===FEED_ID||str(f.feedId)===FEED_ID)||feeds[0]
      const download=chosen?(str(chosen.downloadUrl)||str(chosen.downloadURL)||str(chosen.url)||str(chosen.feedUrl)):""
      if(download.startsWith("https://")){
       const fromInfo=await fetchProductsFrom(download)
       if(fromInfo.length)return fromInfo
      }
     }
     const fromApi=await fetchProductsFrom(API+"/partner/products/feed/"+encodeURIComponent(programId)+"/"+encodeURIComponent(CHANNEL)+"/",headers)
     if(fromApi.length)return fromApi
    } else console.error("[MN feed] CS partner program missing in approved SE programs")
   }else console.error("[MN feed] program listing HTTP",progResp.status)
  }catch(e){console.error("[MN feed] API fetch failed",e instanceof Error?e.message:"unknown error")}
 }
 try{
  const fromXml=await fetchProductsFrom(XML_URL)
  console.info("[MN feed] relevant products",fromXml.length)
  return fromXml
 }catch(e){console.error("[MN feed] XML fetch failed",e instanceof Error?e.message:"unknown error")}
 return []
}
export const getCatalog=unstable_cache(fetchActualCatalog,["mn-torque-products-v5"],{revalidate:1800})
