import { useNavigate } from 'react-router-dom';
import analytics from '../utils/analytics';

/**
 * VideoThumbnail Component for Home Page
 *
 * Displays the video thumbnail with 1/5 badge, red share icon, and play overlay.
 * When clicked, navigates directly to the video page (/video).
 *
 * @param {object} props
 * @param {string} props.posterSrc - Path to thumbnail image
 * @param {string} [props.counterBadge="1 / 5"] - Counter text
 * @param {string} [props.destination="/video"] - Destination route
 */
export default function VideoThumbnail({
  posterSrc = '/assets/poster.jpg',
  counterBadge = '1 / 5',
  destination = '/video',
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    analytics.trackImageClicked();
    navigate(destination);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <figure className="article-video-figure">
      <div
        className="article-video-box is-thumbnail-clickable"
        tabIndex={0}
        role="button"
        aria-label="Click to open video page"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <img
          src={posterSrc}
          alt="Video thumbnail preview"
          className="video-poster-img"
          loading="eager"
        />

        {/* Slide Counter Badge (1 / 5) */}
        {counterBadge && (
          <div className="slide-counter-badge" aria-label={`Photo ${counterBadge}`}>
            <span className="counter-text">{counterBadge}</span>
          </div>
        )}

        {/* Red Share Button */}
        <div className="image-share-pill" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="image-share-svg" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
          </svg>
        </div>

        {/* Play Icon Disc & Prompt */}
        <div className="center-play-overlay">
          <div className="center-play-disc" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="center-play-svg" fill="currentColor">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
          <span className="center-play-text">Watch Video</span>
        </div>
      </div>
    </figure>
  );
}
