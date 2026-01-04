import { useEffect, useState, useRef, useCallback } from 'react';

export function Lightbox({ src, alt, info, onClose, infoVisible, setInfoVisible }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);

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

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Close on click outside (overlay click)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="lightbox-overlay" onClick={handleOverlayClick}>
      <div className="lightbox-content">
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="lightbox-image-wrapper" ref={imageRef}>
          <img src={src} alt={alt} className="lightbox-img" />
          <button
            className="lightbox-fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            )}
          </button>
          {info && (
            <>
              <button
                className="lightbox-info-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleInfo();
                }}
                aria-label="Toggle info"
                title="Toggle info message"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>
              {infoVisible && (
                <div className="lightbox-info-message" onClick={(e) => e.stopPropagation()}>
                  {info}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

