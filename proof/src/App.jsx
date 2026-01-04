import { useState } from 'react';
import { Carousel } from './components/Carousel';
import { VideoPlayer } from './components/VideoPlayer';
import { SCREENSHOTS } from './config';

function App() {
  const [infoVisible, setInfoVisible] = useState(true);

  return (
    <div className="container">
      {/* Introduction Section */}
      <section className="section intro-section">
        <div className="intro-content">
          <h1 className="intro-title">Complaint Intelligence Engine</h1>
          {/* <p className="intro-subtitle">
            Transform customer complaints into business growth — automatically, in real time.
          </p>
          <p className="intro-description">
            CIE is an AI-powered SaaS platform that captures complaints across voice, chat, email, and connected systems. 
            It analyzes sentiment, intent, and churn risk using advanced AI, then automatically converts insights into 
            retention actions and marketing campaigns. Instead of treating complaints as damage control, CIE turns them 
            into a strategic engine for customer loyalty, innovation, and revenue growth.
          </p> */}
        </div>
      </section>

      {/* Top Section: Carousel */}
      <section className="section top-section">
        <header className="text-center mb-4">
          <h2>Feature Walkthrough</h2>
          <p className="text-muted">Interactive demonstration of CIE capabilities</p>
        </header>

        <Carousel items={SCREENSHOTS} infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      </section>

      {/* Bottom Section: Video */}
      <section className="section bottom-section">
        <header className="mb-4">
          <h2>Video Demo</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Watch the complete user journey in action.
          </p>
        </header>

        <VideoPlayer />
      </section>
    </div>
  );
}

export default App;

