'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Package, ShieldCheck } from 'lucide-react';

const inputClass = 'request-input';

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="request-page">
        <div className="request-shell request-success">
          <div className="track-brand"><img src="/maxmove-logo.jpg" alt="MaxMove Logistics" /><div><b>maxmove</b><span> LOGISTICS</span><small>Lagos • International & Interstate Logistics</small></div></div>
          <CheckCircle2 className="success-icon" />
          <span className="badge green">REQUEST RECEIVED</span>
          <h1>We&apos;ll move this forward.</h1>
          <p>Your shipment request has been captured. A MaxMove coordinator will review the details and contact you with a quote.</p>
          <Link href="/" className="btn green">Back to MaxMove <ArrowRight size={16} /></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="request-page">
      <div className="request-shell">
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to MaxMove</Link>
        <div className="request-layout">
          <aside className="request-intro">
            <div className="track-brand"><img src="/maxmove-logo.jpg" alt="MaxMove Logistics" /><div><b>maxmove</b><span> LOGISTICS</span></div></div>
            <span className="badge green">SHIPMENT INTAKE</span>
            <h1>Tell us what needs moving.</h1>
            <p>One simple request for interstate delivery, international shipping, or a recurring logistics route.</p>
            <div className="request-points"><div><Package size={17} /><span><b>Built around your cargo</b>Origin, destination, service and package details in one place.</span></div><div><ShieldCheck size={17} /><span><b>Reviewed by operations</b>A coordinator checks every request before pricing.</span></div></div>
          </aside>
          <form className="request-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <div className="form-heading"><div><span className="eyebrow">NEW REQUEST</span><h2>Shipment details</h2></div><span className="form-step">1 / 1</span></div>
            <div className="request-grid">
              <label>Full name<input className={inputClass} required placeholder="e.g. Amaka Okafor" /></label>
              <label>Phone number<input className={inputClass} required placeholder="+234 800 000 0000" /></label>
              <label>Email address<input className={inputClass} type="email" required placeholder="you@company.com" /></label>
              <label>Service type<select className={inputClass} defaultValue="interstate"><option value="interstate">Interstate logistics</option><option value="international">International shipping</option><option value="local">Local delivery</option></select></label>
              <label>Pickup location<input className={inputClass} required placeholder="City, state or country" /></label>
              <label>Delivery location<input className={inputClass} required placeholder="City, state or country" /></label>
              <label>Preferred movement<select className={inputClass} defaultValue="road"><option value="road">Road freight</option><option value="air">Air freight</option><option value="sea">Sea freight</option></select></label>
              <label>Ready date<input className={inputClass} type="date" required /></label>
              <label className="full-field">What are you shipping?<textarea className={inputClass} required rows={4} placeholder="Describe the items, quantity, weight or any handling needs" /></label>
            </div>
            <button className="btn green form-submit" type="submit">Request a quote <ArrowRight size={16} /></button>
            <p className="form-note">By submitting, you agree that MaxMove may contact you about this request.</p>
          </form>
        </div>
      </div>
    </main>
  );
}
