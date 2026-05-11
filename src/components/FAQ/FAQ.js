
const FAQ = ({ FAQs }) => {
  if (!FAQs || FAQs.length === 0) return null;

  return (
    <section className="py-5">
        <h2 className="fw-bold mb-4">Frequently Asked Questions</h2>
        {FAQs?.map((faq, index) => (
          <details className="border-top" style={{borderColor: 'var(--grey)'}} key={index}>
            <summary className="d-flex align-items-center justify-content-between gap-3 py-3 cursor-pointer list-none fw-semibold" style={{fontFamily: 'var(--sans-serif-font)', fontSize: '17px', color: 'var(--foreground-color)', userSelect: 'none'}}>
              {faq.question}
              <svg className="flex-shrink-0" style={{width: '20px', height: '20px', stroke: 'var(--dark-grey)', strokeWidth: '2', fill: 'none', transition: 'transform 0.2s ease'}} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </summary>
            <div className="pb-3">
              <p className="m-0" style={{fontFamily: 'var(--sans-serif-font)', fontSize: '15px', lineHeight: '1.65', color: 'var(--dark-grey)'}}>{faq.answer}</p>
            </div>
          </details>
        ))}
    </section>
  );
};

export default FAQ;
