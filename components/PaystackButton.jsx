'use client';
import { useState } from 'react';

export default function PaystackButton({ amount, email, metadata, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const initialize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, email, metadata }),
      });
      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (err) {
      alert('Payment error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn-checkout" onClick={initialize} disabled={loading}>
      {loading ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-lock"></i> Pay ₦{amount.toLocaleString()}</>}
    </button>
  );
}