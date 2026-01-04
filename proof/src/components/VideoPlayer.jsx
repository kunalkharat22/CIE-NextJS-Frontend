import { VIDEO_EMBED_URL } from '../config';

export function VideoPlayer() {
  if (VIDEO_EMBED_URL && VIDEO_EMBED_URL.trim() !== "") {
    return (
      <div className="video-wrapper">
        <iframe
          src={VIDEO_EMBED_URL}
          title="Video Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback to local video
  return (
    <div className="video-wrapper">
      <video controls playsInline poster="">
        <source src="/demo.mp4" type="video/mp4" />
        <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
          <p>Video not found.</p>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>
            Place <code>demo.mp4</code> in <code>proof/assets/</code> <br />
            or set <code>VIDEO_EMBED_URL</code> in src/config.js.
          </p>
        </div>
      </video>
    </div>
  );
}

