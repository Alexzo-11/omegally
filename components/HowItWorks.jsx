export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: 'fa-shopping-bag',
      title: 'Browse & Order',
      text: 'Pick any product from our catalog. No links. No WhatsApp groups. Just tap, choose quantity, and add to your cart.',
    },
    {
      num: '02',
      icon: 'fa-wallet',
      title: 'Pay Instantly or in 2 Weeks',
      text: 'Pay the full amount right away, or split it into easy installments over 2 weeks max 3 weeks. 4% interest, no hidden fees.',
    },
    {
      num: '03',
      icon: 'fa-truck',
      title: 'Quick Delivery',
      text: 'Pick up location within Maiduguri, Baga-Road, Post-Office, Unimaid. Special delivery to door Step charges apllies',
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="section-container">
        <div className="hiw-header">
          <span className="section-eyebrow">HOW IT WORKS</span>
          <h2 className="section-title">From Cart to Pickup Point in 3 Steps</h2>
          <p className="section-subtitle">
            A simple, secure way to shop — no more scattered product links.
          </p>
        </div>

        <div className="hiw-grid">
          {steps.map((step, i) => (
            <div key={i} className="hiw-card">
              <div className="hiw-num">{step.num}</div>
              <div className="hiw-icon">
                <i className={`fas ${step.icon}`}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <div className="hiw-delivery-note">
          <div className="hiw-delivery-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <strong>Goods Arrival</strong>
              <span>3rd week of the month, except for special orders</span>
            </div>
          </div>
          <div className="hiw-delivery-item">
            <i className="fas fa-globe"></i>
            <div>
              <strong>Products within Maiduguri</strong>
              <span>Delivered within 3hrs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}