/**
 * Editorial PlayButton Component
 *
 * Clean, high-contrast CTA button matching the Telegraph India editorial mobile aesthetic.
 *
 * @param {object} props
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.label="PLAY VIDEO"] - Button text
 */
export default function PlayButton({ onClick, label = 'PLAY VIDEO' }) {
  return (
    <button
      type="button"
      className="editorial-play-btn"
      onClick={onClick}
      aria-label={label}
    >
      <span className="play-icon-circle" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="play-triangle-svg" fill="currentColor">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </span>
      <span className="play-btn-label">{label}</span>
    </button>
  );
}
