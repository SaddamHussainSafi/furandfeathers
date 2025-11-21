import React from 'react';

const QUESTIONS = [
  {
    question: 'How do I know if a pet is still available?',
    answer:
      'Every pet card is synced with our shelter dashboards. If you can request an application, that pet is still searching for a family.'
  },
  {
    question: 'Can I adopt if I am outside the listed shelter area?',
    answer:
      'Many rescues support out-of-area adoptions. Send a message from the pet profile and the shelter team will share transport guidance.'
  },
  {
    question: 'Is there a fee to use Fur & Feathers?',
    answer:
      'Browsing pets and messaging shelters is free. Individual rescues set their own adoption fees which are paid directly to them.'
  },
  {
    question: 'How does the AI pet detection feature work?',
    answer:
      'Upload a clear photo and our model suggests likely breeds, age ranges, and personality traits so you can tailor your care.'
  },
  {
    question: 'What happens after I submit an application?',
    answer:
      'You can track each application in real time, upload supporting documents, and chat with shelter coordinators for next steps.'
  }
];

export default function FAQ() {
  return (
    <div className="page">
      <section className="page-section">
        <span className="badge">Frequently asked questions</span>
        <h1 className="section-heading">We have answers for every step</h1>
        <p className="section-subheading">
          New to adopting online? Explore the most common questions from adopters, fosters, and shelter teams.
        </p>
        <div className="section-grid section-grid--two">
          {QUESTIONS.map((item) => (
            <article key={item.question} className="surface-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
