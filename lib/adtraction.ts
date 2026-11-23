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

const apiBase = "https://api.adtraction.net/v3"
const programId = process.env.ADTRACTION_PROGRAM_ID
const channelId = process.env.ADTRACTION_CHANNEL_ID
const token = process.env.ADTRACTION_API_TOKEN
const relevant = /momentnyck|momentmejsel|torque\s?wrench|torque\s?screwdriver|momentstav|momentadapter/i

function purposesFor(text: string): string[] {
  const uses: string[] = []
  if (/cykel|bike|bicycle|mtb|precision|finmekanik/i.test(text)) uses.push("cykel", "precision")
  if (/bil|hjul|auto|garage|1\/2|verkstad/i.test(text)) uses.push("bil", "verkstad")
  if (/motorcykel|motorbike|\bmc\b/i.test(text)) uses.push("mc")
  if (/lastbil|truck|tung|industri|3\/4/i.test(text)) uses.push("tung", "industri")
  if (/lantbruk|traktor|maskin/i.test(text)) uses.push("maskin")
  return uses.length ? [...new Set(uses)] : ["allmant"]
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function parseProduct(raw: Record<string, unknown>): CatalogProduct | null {
  const name = readString(raw.productName) || readString(raw.title)
  if (!relevant.test(name)) return null
  const trackingUrl = readString(raw.trackingUrl)
  if (!/^https?:\/\//i.test(trackingUrl)) return null
  const priceValue = raw.productPrice
  const parsed = Number(typeof priceValue === "string" ? priceValue.replace(",", ".").replace(/[^0-9.]/g, "") : priceValue)
  const description = readString(raw.productDescription)
  const category = readString(raw.productCategory)
  return {
    id: readString(raw.sku) || readString(raw.ean) || trackingUrl,
    name,
    description,
    price: Number.isFinite(parsed) && parsed > 0 ? parsed : null,
    currency: readString(raw.currency) || "SEK",
    image: readString(raw.imageUrl),
    trackingUrl,
    brand: readString(raw.manufacturer),
    category,
    purposes: purposesFor([name, description, category].join(" ")),
  }
}

export async function getCatalog(): Promise<CatalogProduct[]> {
  if (!token || !programId || !channelId) return []
  try {
    const url = apiBase + "/partner/products/feed/" + encodeURIComponent(programId) + "/" + encodeURIComponent(channelId) + "/"
    const response = await fetch(url, {
      headers: { "X-Token": token, Accept: "application/json" },
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(20000),
    })
    if (!response.ok) {
      console.error("Adtraction feed status:", response.status)
      return []
    }
    const result: unknown = await response.json()
    const rows = Array.isArray(result) ? result :
      result && typeof result === "object" && "products" in result && Array.isArray(result.products) ? result.products :
      result && typeof result === "object" && "data" in result && Array.isArray(result.data) ? result.data : []
    return rows.filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
      .map(parseProduct).filter((p): p is CatalogProduct => !!p)
  } catch (error) {
    console.error("Adtraction feed unavailable:", error instanceof Error ? error.message : error)
    return []
  }
}
