import React from 'react';

export default function SuccessStories() {
  const stories = [
    {
      quote: "We found Bella through Fur & Feathers. The process was simple and heartfelt.",
      name: "Maria & Luna",
      image: "/bella.jpg" // placeholder
    },
    {
      quote: "Adopting Max was the best decision. The shelter was amazing and supportive.",
      name: "John & Max",
      image: "/max.jpg"
    },
    {
      quote: "Our family grew by four paws thanks to this platform. Highly recommend!",
      name: "Sarah & Whiskers",
      image: "/whiskers.jpg"
    }
  ];

  return (
    <section style={{ padding: '60px 20px', backgroundColor: '#fff8ee' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#46b5a7' }}>Success Stories</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {stories.map((story, index) => (
            <div key={index} style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#46b5a7',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            fontSize: '2rem'
          }}>
            <img src="https://cdn-icons-png.flaticon.com/512/1864/1864514.png" alt="Paw icon" width="40" height="40" loading="lazy" />
          </div>
              <blockquote style={{
                fontStyle: 'italic',
                color: '#666',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                "{story.quote}"
              </blockquote>
              <cite style={{ fontWeight: 'bold', color: '#333' }}>- {story.name}</cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
