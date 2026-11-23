import type { Metadata } from "next"
import "./globals.css"
export const metadata:Metadata = {
 title: { default: "Momentnyckel.se – Hitta rätt momentnyckel", template: "%s | Momentnyckel.se" },
 description: "Hitta momentnycklar för bil, cykel, motorcykel, verkstad och industri. Filtrera efter användningsområde och pris och hitta rätt produkt.",
 metadataBase: new URL("https://momentnyckel.se"),
 openGraph: { title: "Momentnyckel.se – Hitta rätt momentnyckel", description: "Jämför momentnycklar efter behov, användningsområde och budget.", locale: "sv_SE", type:"website" },
}
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="sv"><body className="font-sans antialiased">{children}</body></html>
}