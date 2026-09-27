import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import VideoPage from './pages/VideoPage';
import analytics from './utils/analytics';

/**
 * Main Application Component
 *
 * User Journey:
 * Home Page (Article + Video Thumbnail) -> Click Thumbnail -> Video Page -> Click Video to Play
 */
export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize anonymous session analytics
    const cleanupTracking = analytics.initSessionTracking();

    // 2. Preload poster image
    const img = new Image();
    img.src = '/assets/poster.jpg';

    // 3. Brief minimal initial loader (~1.1s)
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1100);

    return () => {
      clearTimeout(timer);
      cleanupTracking();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app-root">
        {/* Initial Full-Screen Loader */}
        <Loader isLoading={isInitialLoading} />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                posterSrc="/assets/poster.jpg"
                poster2Src="/assets/poster.jpg"
              />
            }
          />
          <Route
            path="/explore"
            element={
              <Explore
                posterSrc="/assets/poster.jpg"
                videoSrc="/assets/video.mp4"
              />
            }
          />
          <Route
            path="/video"
            element={
              <VideoPage
                videoSrc="/assets/video.mp4"
                posterSrc="/assets/poster.jpg"
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
