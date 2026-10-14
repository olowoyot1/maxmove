import DashboardShell from '@/components/DashboardShell'
import { notFound } from 'next/navigation'

const sections: Record<string, { title: string; heading: string; description: string }> = {
  dispatch: { title: 'Dispatch & Routes', heading: 'Dispatch control center', description: 'Coordinate drivers, routes, and delivery handoffs from one workspace.' },
  tracking: { title: 'Tracking Activity', heading: 'Tracking activity', description: 'Review the latest shipment movement and status updates.' },
  fleet: { title: 'Fleet', heading: 'Fleet overview', description: 'Monitor vehicle availability, route assignments, and maintenance.' },
  drivers: { title: 'Drivers', heading: 'Driver directory', description: 'Manage driver assignments and contact details.' },
  warehouse: { title: 'Warehouse', heading: 'Warehouse operations', description: 'Track inbound cargo, storage, and export readiness.' },
  finance: { title: 'Invoices & Payments', heading: 'Accounts & finance', description: 'Review invoices, payment status, and outstanding balances.' },
  customers: { title: 'Customers', heading: 'Customer directory', description: 'Keep customer contacts and shipment relationships organized.' },
  analytics: { title: 'Analytics', heading: 'Reports & analytics', description: 'Understand shipment volume, delivery performance, and operations trends.' },
  settings: { title: 'Settings', heading: 'Workspace settings', description: 'Configure MaxMove workspace preferences and staff access.' },
}

export default async function DashboardSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const content = sections[section]
  if (!content) notFound()

  return <DashboardShell title={content.title}><div className="page-head"><div><span className="badge green">MAXMOVE WORKSPACE</span><h2>{content.heading}</h2><p className="muted">{content.description}</p></div></div><div className="card empty-state"><h3>Ready for operations</h3><p className="muted">This module is connected to the MaxMove workspace and ready for live records.</p></div></DashboardShell>
}

export function generateStaticParams() { return Object.keys(sections).map(section => ({ section })) }

export const dynamicParams = false
