import { useEffect } from 'react';
import EditorialHeader from '../components/EditorialHeader';
import VideoThumbnail from '../components/VideoThumbnail';
import StickyAdBanner from '../components/StickyAdBanner';
import analytics from '../utils/analytics';

/**
 * Page 1: Landing Page (Telegraph India Mobile Article)
 *
 * Shows the article with the video thumbnail (poster + 1/5 badge + play icon).
 * Clicking the thumbnail navigates to the next page (/video).
 */
export default function Landing({
  posterSrc = '/assets/poster.jpg',
  poster2Src = '/assets/poster2.jpg',
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
    analytics.recordPageView('landing');
  }, []);

  return (
    <div className="mobile-news-wrapper">
      {/* Top Editorial Category Navigation */}
      <EditorialHeader />

      {/* Main Article Container */}
      <article className="article-container">
        {/* Article Header */}
        <header className="article-header">
          <h1 className="article-main-headline">
            iPhone 18 Pro Max brings variable aperture and a more serious approach to smartphone photography
          </h1>

          <p className="article-subheadline">
            iPhone 18 Pro Max review: Explore its variable aperture, improved low-light photography, camera controls, film look, video features and more
          </p>

          <div className="article-meta-block">
            <span className="author-name">Mathures Paul</span>
            <time className="publish-date" dateTime="2026-09-27T08:35">
              Published 27.09.26, 08:35 AM
            </time>
          </div>

          {/* Social Share Icons Row */}
          <div className="social-share-row" aria-label="Share this story">
            <button type="button" className="social-icon-btn" aria-label="Share on Facebook">
              <span className="social-icon-f">f</span>
            </button>
            <button type="button" className="social-icon-btn" aria-label="Share on X">
              <span className="social-icon-x">𝕏</span>
            </button>
            <button type="button" className="social-icon-btn" aria-label="Share on WhatsApp">
              <svg viewBox="0 0 24 24" className="social-whatsapp-svg" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Paragraph 1 */}
        <p className="article-paragraph">
          It is unlike any other year for iPhones. First, as the buzz around the new devices has gathered considerable momentum. We visited a few stores to find the iPhone 18 Pro flying off shelves, with queues outside. Perhaps it has everything to do with photography. Over the years, Apple has got many users interested in photography through entry-level iPhones, and many of them are becoming Pro users.
        </p>

        {/* VIDEO THUMBNAIL (1/5) - User clicks thumbnail to navigate to the video page */}
        <VideoThumbnail
          posterSrc={posterSrc}
          counterBadge="1 / 5"
          destination="/video"
        />

        {/* Paragraph 2 */}
        <p className="article-paragraph">
          A new chip, better battery life, and much-improved thermals give iPhone 18 Pro Max better sustained performance and make it particularly when most people would rather not think about camera settings at all.
        </p>

        {/* Paragraph 3 */}
        <p className="article-paragraph">
          The variable aperture sits alongside a new sensor in the main camera and a new computational photography pipeline that delivers sharper, cleaner images in low light. Resolution remains at 48 megapixels, the same as on last year&apos;s iPhone 17 Pro Max, so there is no upgrade on that front. That is hardly a drawback, however. Forty-eight megapixels is ample, particularly for those who need to crop without losing image quality. The aperture can now be opened as wide as f/1.48 or closed down to f/4.0. By comparison, the iPhone 17 Pro Max had a fixed aperture of f/1.8, with no way to adjust it in either direction.
        </p>

        {/* IMAGE 2: Camera Module (2/5) */}
        <figure className="article-media-figure">
          <div className="article-image-box">
            <img
              src={poster2Src}
              alt="iPhone 18 Pro Max variable aperture lens mechanism"
              className="article-inline-image"
              loading="lazy"
            />

            {/* Slide Counter Badge (2/5) */}
            <div className="slide-counter-badge" aria-label="Photo 2 of 5">
              <span className="counter-current">2</span>
              <span className="counter-divider">/</span>
              <span className="counter-total">5</span>
            </div>

            <div className="image-share-pill" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="image-share-svg" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
            </div>
          </div>
        </figure>

        {/* Paragraph 4 */}
        <p className="article-paragraph">
          To appreciate why this matters, it helps to understand what aperture is. It is controlled by a set of blades inside the lens that open and close. The wider they open, the more light reaches the sensor, and the more they close, the less light gets in. Aperture is measured in f-stops. The lower the f-number, the wider the aperture and the brighter the image, while the higher the f-number, the narrower the aperture and the darker the image. Its primary purpose is to control exposure, while background blur is a secondary benefit.
        </p>

        {/* Paragraph 5 */}
        <p className="article-paragraph">
          The ability to close the aperture down means sharper edge-to-edge details and deeper depth-of-field, unlocking cinematic video capture and true optical control right from the smartphone.
        </p>
      </article>

      {/* Sticky Bottom Ad Card from screenshot */}
      <StickyAdBanner />
    </div>
  );
}
