export function money(value:number|null,currency:string){
 if(value===null)return "Se pris hos återförsäljaren"
 try{return new Intl.NumberFormat("sv-SE",{style:"currency",currency,maximumFractionDigits:0}).format(value)}
 catch{return value.toLocaleString("sv-SE")+" kr"}
}
