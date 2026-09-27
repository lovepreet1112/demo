import { useState } from 'react';

/**
 * Sticky Bottom Sponsor Ad Banner
 * Matches the mobile screenshot banner: "Learn About Personal Loans"
 */
export default function StickyAdBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside className="sticky-ad-banner" aria-label="Sponsored advertisement">
      <button
        type="button"
        className="ad-close-btn"
        onClick={() => setIsVisible(false)}
        aria-label="Close advertisement"
      >
        <svg viewBox="0 0 24 24" className="ad-close-svg" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="ad-content-wrapper">
        <div className="ad-text-block">
          <h4 className="ad-headline">Learn About Personal Loans</h4>
          <div className="ad-subline">
            <span className="ad-sponsor-name">LightingPort</span>
            <span className="ad-info-icon" title="Ad choices">ⓘ</span>
          </div>
        </div>

        <a
          href="#ad"
          className="ad-action-btn"
          onClick={(e) => e.preventDefault()}
        >
          Open &gt;
        </a>
      </div>
    </aside>
  );
}
