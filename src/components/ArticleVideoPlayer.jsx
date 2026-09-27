import { useState, useRef } from 'react';
import analytics from '../utils/analytics';

/**
 * ArticleVideoPlayer Component
 *
 * Replaces static image with an interactive in-article video player.
 * Displays poster with 1/5 badge and play icon.
 * When clicked, immediately starts playing the video inline with native controls.
 *
 * @param {object} props
 * @param {string} props.posterSrc - Path to poster image
 * @param {string} props.videoSrc - Path to video file
 * @param {string} [props.counterBadge="1 / 5"] - Slide counter badge text
 */
export default function ArticleVideoPlayer({
  posterSrc = '/assets/poster.jpg',
  videoSrc = '/assets/video.mp4',
  counterBadge = '1 / 5',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  const handleStartPlay = () => {
    setIsPlaying(true);
    setHasError(false);

    if (videoRef.current) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsBuffering(false);
            analytics.trackVideoStarted({
              source: 'inline_article_click',
              duration: videoRef.current.duration || 0,
            });
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.warn('[ArticleVideoPlayer] Play interrupted or blocked:', err);
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
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setHasError(false);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => setIsBuffering(false))
        .catch(() => {
          setIsBuffering(false);
          setHasError(true);
        });
    }
  };

  return (
    <figure className="article-video-figure">
      <div
        className={`article-video-box ${isPlaying ? 'is-active' : 'is-poster-state'}`}
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
        {/* Native HTML5 Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          controls={isPlaying}
          muted
          playsInline
          preload="metadata"
          className="inline-article-video"
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onCanPlay={() => setIsBuffering(false)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
        />

        {/* Poster & Play Overlay (Visible before clicking) */}
        {!isPlaying && (
          <div className="video-poster-overlay">
            <img
              src={posterSrc}
              alt="Video preview poster"
              className="video-poster-img"
              loading="eager"
            />

            {/* Slide Counter Badge (e.g. 1 / 5) */}
            {counterBadge && (
              <div className="slide-counter-badge" aria-label={`Photo ${counterBadge}`}>
                <span className="counter-text">{counterBadge}</span>
              </div>
            )}

            {/* Red Share Button in bottom right corner */}
            <div className="image-share-pill" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="image-share-svg" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
            </div>

            {/* Centered Play Button Overlay */}
            <div className="center-play-overlay">
              <div className="center-play-disc">
                <svg viewBox="0 0 24 24" className="center-play-svg" fill="currentColor">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </div>
              <span className="center-play-text">Click to Play Video</span>
            </div>
          </div>
        )}

        {/* Buffering State */}
        {isPlaying && isBuffering && !hasError && (
          <div className="video-buffering-indicator" aria-label="Loading video">
            <div className="video-spinner" />
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="video-error-box" role="alert">
            <p className="error-title">Unable to play video</p>
            <button
              type="button"
              className="error-retry-action"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </figure>
  );
}
