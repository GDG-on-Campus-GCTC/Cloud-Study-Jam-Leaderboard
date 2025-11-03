'use client'

const DeadlineTimer = () => {
  const message = 'Campaign Completed! ☁️ Thank you for powering the Google Cloud Study Jams journey.';

  return (
    <section className="w-full my-8">
      <div className="marquee-container">
        <div className="marquee-track">
          <span className="marquee-text">{message}</span>
          <span className="marquee-text" aria-hidden="true">{message}</span>
          <span className="marquee-text" aria-hidden="true">{message}</span>
        </div>
      </div>
    </section>
  );
};

export default DeadlineTimer;