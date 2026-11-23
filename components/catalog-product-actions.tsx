"use client"
import {useEffect,useState} from "react"
import {Heart,Scale} from "lucide-react"
function read(key:string){try{const v=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(v)?v as string[]:[]}catch{return []}}
export function CatalogProductActions({id}:{id:string}){
 const [fav,setFav]=useState(false);const [comp,setComp]=useState(false)
 useEffect(()=>{setFav(read("mn-favorites").includes(id));setComp(read("mn-compare").includes(id))},[id])
 const toggle=(key:string,active:boolean,on:(v:boolean)=>void)=>{
  const existing=read(key);const next=active?existing.filter(x=>x!==id):existing.length>=4&&key==="mn-compare"?existing:[...existing,id]
  localStorage.setItem(key,JSON.stringify(next));on(next.includes(id));window.dispatchEvent(new Event("mn:updated"))
 }
 return <div className="flex flex-wrap gap-3">
  <button onClick={()=>toggle("mn-favorites",fav,setFav)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"><Heart className={"size-4 "+(fav?"fill-amber-400 text-amber-700":"")}/>{fav?"Sparad favorit":"Spara favorit"}</button>
  <button onClick={()=>toggle("mn-compare",comp,setComp)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"><Scale className={"size-4 "+(comp?"text-amber-700":"")}/>{comp?"Vald för jämförelse":"Lägg till jämförelse"}</button>
 </div>
}
