'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Truck, Users, Warehouse, WalletCards, BarChart3, Settings, UserRound, MapPinned, Globe2, Route, Sparkles } from 'lucide-react';
const groups=[
 {label:'Overview',items:[['Dashboard','/dashboard',LayoutDashboard]]},
 {label:'Operations',items:[['Shipments','/dashboard/shipments',Package],['Dispatch & Routes','/dashboard/dispatch',Route],['Tracking Activity','/dashboard/tracking',MapPinned]]},
 {label:'Fleet & Drivers',items:[['Fleet','/dashboard/fleet',Truck],['Drivers','/dashboard/drivers',UserRound]]},
 {label:'Warehouse',items:[['Warehouse','/dashboard/warehouse',Warehouse]]},
 {label:'Accounts & Finance',items:[['Invoices & Payments','/dashboard/finance',WalletCards]]},
 {label:'Customers',items:[['Customers','/dashboard/customers',Users],['Form Builder','/dashboard/forms',Sparkles]]},
 {label:'Reports & Analytics',items:[['Analytics','/dashboard/analytics',BarChart3]]},
 {label:'AI & Tools',items:[['MaxMove AI','/ai',Sparkles]]},
 {label:'Administration',items:[['Settings','/dashboard/settings',Settings]]}
];
export default function Sidebar(){const path=usePathname(); return <aside className="sidebar"><div className="brand"><img src="/maxmove-logo.jpg" alt="MaxMove Logistics"/><div><strong>maxmove</strong><span>LOGISTICS</span></div></div><div className="sidebar-location"><Globe2 size={14}/><span>Lagos, Nigeria</span></div><nav className="nav">{groups.map(g=><div key={g.label}><div className="nav-label">{g.label}</div>{g.items.map(([label,href,Icon]:any)=><Link key={label} className={path===href||path.startsWith(href+'/')?'active':''} href={href}><Icon/> {label}</Link>)}</div>)}</nav></aside>}
