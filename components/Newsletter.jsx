export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="container">
        <div className="box">
          <h2>Stay in the Loop</h2>
          <p>Get the latest deals, new features, and installment tips delivered to your inbox.</p>
          <div className="input-group">
            <input className="input" type="email" placeholder="Enter your email" />
            <button className="btn">Subscribe <i className="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
}