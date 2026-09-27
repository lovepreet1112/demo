import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorialHeader from '../components/EditorialHeader';
import StickyAdBanner from '../components/StickyAdBanner';
import analytics from '../utils/analytics';

/**
 * Page 2 / 3: Video Page
 *
 * Dedicated video page reached after clicking the video thumbnail on the home page.
 * Shows the video prominently with a play overlay.
 * When user clicks on the video, it starts playing inline.
 */
export default function VideoPage({
  videoSrc = '/assets/video.mp4',
  posterSrc = '/assets/poster.jpg',
}) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    analytics.recordPageView('video');
  }, []);

  const handleStartPlay = () => {
    setIsPlaying(true);
    setHasError(false);

    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsBuffering(false);
            analytics.trackVideoStarted({
              source: 'video_page_click',
              duration: videoRef.current.duration || 0,
            });
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.warn('[VideoPage] Playback blocked or interrupted:', err);
            setIsBuffering(false);
          });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      analytics.trackVideoProgress(
        videoRef.current.currentTime,
        videoRef.current.duration
      );
    }
  };

  const handleEnded = () => {
    analytics.trackVideoCompleted({
      duration: videoRef.current ? videoRef.current.duration : 0,
    });
  };

  const handleError = () => {
    setIsBuffering(false);
    setHasError(true);
    setErrorMessage('Unable to load or play video.');
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setHasError(false);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => {
          setIsBuffering(false);
          setIsPlaying(true);
          analytics.trackVideoStarted({ isRetry: true });
        })
        .catch((err) => {
          setIsBuffering(false);
          setHasError(true);
          setErrorMessage(err.message);
        });
    }
  };

  return (
    <div className="mobile-news-wrapper">
      <EditorialHeader />

      <main className="video-article-container">
        {/* Editorial Headline for the Video Feature */}
        <header className="video-feature-header">
          <span className="video-feature-tag">SPECIAL VIDEO FEATURE</span>
          <h1 className="video-feature-headline">
            Watch: iPhone 18 Pro Max Camera Video &amp; Aperture Test
          </h1>
          <button
            type="button"
            className="video-return-link"
            onClick={() => navigate('/')}
          >
            &larr; Back to full article
          </button>
        </header>

        {/* Video Player Box (Click video to play) */}
        <div
          className={`video-player-frame ${isPlaying ? 'is-playing' : 'is-click-to-play'}`}
          onClick={!isPlaying ? handleStartPlay : undefined}
          tabIndex={!isPlaying ? 0 : -1}
          role={!isPlaying ? 'button' : 'region'}
          aria-label={!isPlaying ? 'Click to play video' : 'Video player'}
          onKeyDown={(e) => {
            if (!isPlaying && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleStartPlay();
            }
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            controls={isPlaying}
            playsInline
            preload="metadata"
            className="editorial-video-element"
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onCanPlay={() => setIsBuffering(false)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={handleError}
          />

          {/* Video Poster & Play Disc (Visible before user clicks the video) */}
          {!isPlaying && (
            <div className="video-poster-overlay">
              <img
                src={posterSrc}
                alt="Video poster preview"
                className="video-poster-img"
                loading="eager"
              />
              <div className="center-play-overlay">
                <div className="center-play-disc" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="center-play-svg" fill="currentColor">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                </div>
                <span className="center-play-text">Click Video to Play</span>
              </div>
            </div>
          )}

          {/* Buffering Indicator */}
          {isPlaying && isBuffering && !hasError && (
            <div className="video-buffering-indicator" aria-label="Loading video">
              <div className="video-spinner" />
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="video-error-box" role="alert">
              <p className="error-title">Playback Error</p>
              <p className="error-message">{errorMessage}</p>
              <button
                type="button"
                className="error-retry-action"
                onClick={handleRetry}
              >
                Retry Playback
              </button>
            </div>
          )}
        </div>
      </main>

      <StickyAdBanner />
    </div>
  );
}
