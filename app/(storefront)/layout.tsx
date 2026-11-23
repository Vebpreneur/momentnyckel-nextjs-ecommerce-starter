import type {ReactNode} from "react"
import {StoreHeader} from "@/components/layout/store-header"
import {StoreFooter} from "@/components/layout/store-footer"
import {BackToTop} from "@/components/layout/back-to-top"
export default function StorefrontLayout({children}:{children:ReactNode}){
 return <div className="flex min-h-screen flex-col bg-background"><StoreHeader/><main id="main-content" className="flex-1">{children}</main><StoreFooter/><BackToTop/></div>
}
