import type {Metadata} from "next"
import {Bricolage_Grotesque,Figtree,JetBrains_Mono} from "next/font/google"
import {ThemeProvider} from "next-themes"
import {SkipLink} from "@/components/layout/skip-link"
import "./globals.css"
import "./mn-theme.css"
const display=Bricolage_Grotesque({variable:"--font-bricolage",subsets:["latin"]})
const body=Figtree({variable:"--font-figtree",subsets:["latin"]})
const mono=JetBrains_Mono({variable:"--font-jetbrains",subsets:["latin"]})
export const metadata:Metadata={
 metadataBase:new URL("https://momentnyckel.se"),
 title:{default:"Momentnycklar, produktväljare & jämförelser | MN",template:"%s | MN"},
 description:"Hitta rätt momentnyckel. Utforska produkter, filtrera efter Nm, fäste och pris, jämför modeller och läs detaljerade produktbeskrivningar.",
 openGraph:{title:"MN – Hitta rätt momentnyckel",description:"Specialiserad produktkatalog och produktväljare för momentnycklar.",type:"website",locale:"sv_SE"}
}
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="sv" suppressHydrationWarning><body className={display.variable+" "+body.variable+" "+mono.variable+" font-sans antialiased"}><ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}><SkipLink/>{children}</ThemeProvider></body></html>
}
