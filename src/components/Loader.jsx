import { useState } from 'react';

/**
 * Editorial Clean Loader
 * Minimal, fast loading indicator matching the Telegraph India editorial aesthetic.
 */
export default function Loader({ isLoading, onExited }) {
  const [hasExited, setHasExited] = useState(false);

  if (hasExited) return null;

  const handleTransitionEnd = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      setHasExited(true);
      if (onExited) onExited();
    }
  };

  return (
    <div
      className={`editorial-loader-overlay ${!isLoading ? 'is-fading-out' : ''}`}
      role="status"
      aria-label="Loading article"
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="editorial-loader-spinner" />
    </div>
  );
}
