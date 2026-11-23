import Link from "next/link"
const links=[["Alla momentnycklar","/products"],["Produktväljare","/#valjare"],["Användningsområden","/#kategorier"],["Köpguide","/#guide"]]
export function StoreFooter(){return <footer className="border-t border-slate-200 bg-white"><div className="mx-auto max-w-[1500px] px-5 py-14"><div className="grid gap-8 md:grid-cols-3">
 <div><h2 className="font-heading text-2xl font-black italic text-[#0c1928]">MN</h2><p className="mt-3 max-w-sm text-sm text-slate-600">Hitta, jämför och upptäck momentnycklar för alla användningsområden.</p></div>
 <div><h3 className="font-semibold">Utforska</h3><nav className="mt-3 grid gap-2">{links.map(([n,u])=><Link key={u} href={u} className="text-sm text-slate-600 hover:text-amber-700">{n}</Link>)}</nav></div>
 <div><h3 className="font-semibold">Om tjänsten</h3><p className="mt-3 text-sm leading-6 text-slate-600">Vi jämför produkter och hjälper dig välja rätt. Köp genomförs hos återförsäljaren. Vissa länkar kan ge oss ersättning.</p></div>
 </div><div className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-500">© {new Date().getFullYear()} MN · Momentnyckel.se. Priser och tillgänglighet kan ändras.</div></div></footer>}
