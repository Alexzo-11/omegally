'use client';

import { useState } from 'react';

const faqs = [
  { q: 'How does the product import work?', a: 'Simply paste any product URL from Amazon, AliExpress, Temu, Shein, eBay, Walmart, Jumia, or any other online store. Our system will automatically fetch the product details. If automatic extraction fails, you can manually fill in the details.' },
  { q: 'What payment methods are supported?', a: 'We support debit cards, bank transfers, and wallet payments. You can also use promo codes and coupons for discounts.' },
  { q: 'Can I change my installment plan?', a: 'Yes, you can adjust your installment plan at any time. You can switch between weekly, biweekly, monthly, or custom plans.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use JWT authentication, bcrypt encryption, Helmet, rate limiting, and all industry-standard security practices to keep your data safe.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq">
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle" style={{ margin: '8px auto 0' }}>Everything you need to know.</p>
        </div>
        <div className="accordion">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="accordion-item">
                <div className={`question ${isOpen ? 'open' : ''}`} onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                  {item.q}
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className={`answer ${isOpen ? 'open' : ''}`}>{item.a}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}