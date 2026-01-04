import { useState, useEffect, useRef, useCallback } from 'react';
import { Lightbox } from './Lightbox';

export function Carousel({ items, infoVisible, setInfoVisible }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const thumbRef = useRef(null);
  const imageRef = useRef(null);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);
  const toggleInfo = () => setInfoVisible(prev => !prev);

  const toggleFullscreen = useCallback(async (e) => {
    e.stopPropagation();
    if (!imageRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await imageRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const next = useCallback(() => setIndex(i => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + items.length) % items.length), [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  // Scroll active thumbnail into view
  useEffect(() => {
    const el = document.querySelector(`.thumb[data-index="${index}"]`);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [index]);

  const current = items[index];

  return (
    <div className="carousel-container">
      <div className="card">
        <div
          className="screen-frame mb-2"
          onClick={openLightbox}
          style={{ cursor: 'zoom-in' }}
          title="Click to expand"
          ref={imageRef}
        >
          <img src={current.src} alt={current.caption} className="screen-img" />
          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            )}
          </button>
          {current.info && (
            <>
              <button
                className="info-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleInfo();
                }}
                aria-label="Toggle info"
                title="Toggle info message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>
              {infoVisible && (
                <div className="info-message" onClick={(e) => e.stopPropagation()}>
                  {current.info}
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-center mb-2">
          <div className="caption-text">{current.caption}</div>
        </div>

        {lightboxOpen && (
          <Lightbox
            src={current.src}
            alt={current.caption}
            info={current.info}
            onClose={closeLightbox}
            infoVisible={infoVisible}
            setInfoVisible={setInfoVisible}
          />
        )}

        {/* Controls Row */}
        <div className="controls">
          <button className="btn" onClick={prev} aria-label="Previous">
            &larr;
          </button>
          <span className="counter">
            {index + 1} / {items.length}
          </span>
          <button className="btn" onClick={next} aria-label="Next">
            &rarr;
          </button>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {items.length > 1 && (
        <div className="thumbnails" ref={thumbRef}>
          {items.map((item, i) => (
            <div
              key={i}
              data-index={i}
              className={`thumb ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              title={item.caption}
            >
              <img src={item.src} className="thumb-img" alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

