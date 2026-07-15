function Section({ children }) {
  return (
    <section className="page-section">
      <div className="container">
        {children}
      </div>
    </section>
  );
}

export default Section;