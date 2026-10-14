'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RequestPage() {
  return (
    <main className="request-page">
      <div className="request-shell">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to MaxMove
        </Link>
        <div className="request-intro">
          <div className="track-brand">
            <img src="/maxmove-logo.jpg" alt="MaxMove Logistics" />
            <div>
              <b>maxmove</b><span> LOGISTICS</span>
            </div>
          </div>
          <span className="badge green">SHIPMENT INTAKE</span>
          <h1>Tell us what needs moving.</h1>
          <p>Complete the shipment request below. Our operations team will review it and contact you with a quote.</p>
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-md" style={{ height: '800px' }}>
          <iframe
            title="MaxMove shipment request form"
            src="https://docs.google.com/forms/d/1eiPcwpLSAiMnX8YcWhSqq3LUlSIiUuFtVrvA-bq_e64/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading…
          </iframe>
        </div>
      </div>
    </main>
  );
}
