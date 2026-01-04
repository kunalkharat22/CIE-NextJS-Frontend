import { Carousel } from './components/Carousel';
import { VideoPlayer } from './components/VideoPlayer';
import { SCREENSHOTS } from './config';

function App() {
  return (
    <div className="container">
      {/* Top Section: Carousel */}
      <section className="section top-section">
        <header className="text-center mb-4">
          <h1>Welcome to CIE!</h1>
          <p className="text-muted">Walkthrough & Feature Demonstration</p>
        </header>

        <Carousel items={SCREENSHOTS} />
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

