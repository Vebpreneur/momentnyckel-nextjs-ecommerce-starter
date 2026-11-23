import type { Metadata } from "next"
import { MomentFinder } from "@/components/moment-finder"
import { getCatalog } from "@/lib/adtraction"
export const metadata:Metadata={title:"Alla momentnycklar"}
export const revalidate=21600
export default async function ProductsPage({searchParams}:{searchParams:Promise<{use?:string,q?:string}>}) {
 const {use,q}=await searchParams
 const products=await getCatalog()
 return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  <nav className="mb-7 text-xs text-muted-foreground"><a href="/">Startsida</a> / Produkter</nav>
  <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Alla momentnycklar</h1>
  <p className="mb-10 mt-3 text-sm text-muted-foreground">Jämför momentnycklar och välj ett alternativ som passar ditt användningsområde och din budget.</p>
  <MomentFinder products={products} initialUsage={use} initialQuery={q}/>
 </div>
}