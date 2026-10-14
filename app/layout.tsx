import './globals.css'; import type { Metadata } from 'next';
export const metadata: Metadata={title:'MaxMove Logistics | International & Interstate Shipping',description:'MaxMove Logistics — Lagos-based international shipping and interstate logistics platform.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className="bg-background"><body>{children}</body></html>}
