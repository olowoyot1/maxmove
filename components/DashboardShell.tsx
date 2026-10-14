import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Sidebar from './Sidebar';
export default function DashboardShell({title,children}:{title:string;children:React.ReactNode}){return <div className="shell"><Sidebar/><main className="main"><header className="topbar"><div><div className="eyebrow">MAXMOVE OPERATIONS • PRIVATE WORKSPACE</div><h1>{title}</h1></div><div className="topbar-actions"><Link href="/" className="website-link">Customer website <ExternalLink size={13}/></Link><div className="user"><div><strong>Operations Admin</strong><small>Backoffice</small></div><div className="avatar">M</div></div></div></header><section className="content">{children}</section></main></div>}
