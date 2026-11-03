export default function Testimonials() {
  const testimonials = [
    {
      name: 'Aisha Bello',
      location: 'Maiduguri',
      initials: 'AB',
      quote:
        "I ordered a phone case and got it in less than 2 days. I didn't have to join any WhatsApp group or send money to a stranger. This is how shopping should feel.",
      rating: 5,
    },
    {
      name: 'Emmanuel Okonkwo',
      location: 'Abuja',
      initials: 'EO',
      quote:
        'The installment plan saved me. I paid across 3 weeks and got my laptop delivered exactly when they said. No hidden charges, no stress.',
      rating: 5,
    },
    {
      name: 'Fatima Ibrahim',
      location: 'Damaturu',
      initials: 'FI',
      quote:
        'I used to buy from group chats and got scammed twice. Omegally has a proper receipt, tracking, and a support team that answers. Worth every naira.',
      rating: 5,
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="section-container">
        <div className="testimonials-header">
          <span className="section-eyebrow">TESTIMONIALS</span>
          <h2 className="section-title">Stories From Real People</h2>
          <p className="section-subtitle">
            Hear from customers who replaced the chaos of group chats with a real store.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <i key={idx} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testimonial-quote">“{t.quote}”</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-location">
                    <i className="fas fa-map-marker-alt"></i> {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}