import { useEffect } from 'react';
import EditorialHeader from '../components/EditorialHeader';
import ArticleVideoPlayer from '../components/ArticleVideoPlayer';
import StickyAdBanner from '../components/StickyAdBanner';
import analytics from '../utils/analytics';

/**
 * Page 2: Explore / Content Page
 *
 * Consistent Telegraph India editorial mobile aesthetic:
 * 1. Category Navigation
 * 2. Small Title / Eyebrow
 * 3. Main Title
 * 4. Supporting Text
 * 5. Direct Video Player (User clicks directly on video to play - NO extra buttons)
 */
export default function Explore({
  posterSrc = '/assets/poster.jpg',
  videoSrc = '/assets/video.mp4',
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
    analytics.recordPageView('explore');
  }, []);

  return (
    <div className="mobile-news-wrapper">
      <EditorialHeader />

      <main className="explore-article-container">
        <div className="explore-editorial-content">
          {/* 1. Small Title */}
          <span className="explore-eyebrow">A NEW EXPERIENCE</span>

          {/* 2. Main Title */}
          <h1 className="explore-main-headline">
            Something worth discovering
          </h1>

          {/* 3. Supporting Text */}
          <p className="explore-body-text">
            Step into the next chapter of smartphone optics. Our hands-on review explores how the variable aperture and sensor upgrades transform everyday captures into cinematic footage.
          </p>

          <p className="explore-body-text">
            Tap the video below to watch our complete breakdown of real-world lens behaviors, f-stop transitions, and low-light samples:
          </p>

          {/* Video Player Directly - Click Video to Play (No button!) */}
          <div className="explore-video-wrapper">
            <ArticleVideoPlayer
              posterSrc={posterSrc}
              videoSrc={videoSrc}
              counterBadge="VIDEO REVIEW"
            />
          </div>
        </div>
      </main>

      <StickyAdBanner />
    </div>
  );
}
