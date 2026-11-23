import {NextResponse} from "next/server"
import {getCatalog} from "@/lib/adtraction"
export const dynamic="force-dynamic"
export async function GET(){
 const products=await getCatalog()
 return NextResponse.json({ready:products.length>0,productCount:products.length,source:"Adtraction product feed",updated:"cached",message:products.length?"Produktkatalogen är tillgänglig":"Inga relevanta produktposter kunde hämtas"}, {headers:{"Cache-Control":"public, max-age=0, s-maxage=300"}})
}
