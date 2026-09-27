/**
 * Anonymous Frontend Analytics & Engagement Tracking Utility
 *
 * Tracks session progression across the 3-step cinematic journey:
 * Landing -> Scroll to Image -> Explore Page -> Video Page
 *
 * Captures:
 * - session_started
 * - landing_page_viewed
 * - image_viewed
 * - image_clicked
 * - explore_page_viewed
 * - video_button_clicked
 * - video_page_viewed
 * - video_started
 * - video_progress (25%, 50%, 75%)
 * - video_completed
 * - session_ended
 *
 * Computes:
 * - Total session duration (seconds)
 * - Time spent on landing page (seconds)
 * - Time spent on explore page (seconds)
 * - Time spent on video page (seconds)
 *
 * Zero Personally Identifiable Information (PII) collected.
 * Modular adapter architecture for Google Analytics, Firebase, Supabase, or backend API.
 */

class AnalyticsService {
  constructor() {
    this.sessionStartTime = null;
    this.isInitialized = false;
    this.adapters = [];

    // Page time tracking
    this.currentPage = null;
    this.pageEnterTime = null;
    this.timeSpent = {
      landing: 0,
      explore: 0,
      video: 0,
    };

    // Engagement flags to avoid redundant triggers
    this.imageViewedReported = false;
    this.videoMilestonesReported = new Set();
    this.hasVideoStarted = false;
    this.lastVisibilityState = 'visible';
  }

  /**
   * Register custom external analytics adapter (GA4, Firebase, Supabase, Custom API)
   * @param {Function} adapter - (eventName, data) => void
   * @returns {Function} Unsubscribe function
   */
  registerAdapter(adapter) {
    if (typeof adapter === 'function') {
      this.adapters.push(adapter);
    }
    return () => {
      this.adapters = this.adapters.filter((a) => a !== adapter);
    };
  }

  /**
   * Get approximate total session duration in seconds
   * @returns {number}
   */
  getTotalDuration() {
    if (!this.sessionStartTime) return 0;
    return Math.max(0, Math.floor((Date.now() - this.sessionStartTime) / 1000));
  }

  /**
   * Update and return time spent metrics for all pages
   * @returns {{landing: number, explore: number, video: number, total: number}}
   */
  getTimeMetrics() {
    const metrics = { ...this.timeSpent };
    if (this.currentPage && this.pageEnterTime && this.timeSpent[this.currentPage] !== undefined) {
      const activeDuration = Math.max(0, Math.floor((Date.now() - this.pageEnterTime) / 1000));
      metrics[this.currentPage] += activeDuration;
    }
    return {
      timeSpentLandingSeconds: metrics.landing,
      timeSpentExploreSeconds: metrics.explore,
      timeSpentVideoSeconds: metrics.video,
      totalSessionDurationSeconds: this.getTotalDuration(),
    };
  }

  /**
   * Core dispatcher for analytics events
   * @param {string} eventName
   * @param {object} payload
   */
  trackEvent(eventName, payload = {}) {
    const timeMetrics = this.getTimeMetrics();
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...timeMetrics,
      ...payload,
    };

    // Premium formatted console output for developer clarity
    const badgeStyle = 'background: #4f46e5; color: #ffffff; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 11px;';
    const textStyle = 'color: #38bdf8; font-weight: 600; font-size: 11px;';

    // eslint-disable-next-line no-console
    console.log(
      `%c[Analytics]%c ${eventName}`,
      badgeStyle,
      textStyle,
      eventData
    );

    // Forward to any registered external adapters
    this.adapters.forEach((adapter) => {
      try {
        adapter(eventName, eventData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[Analytics] Adapter error on "${eventName}":`, err);
      }
    });
  }

  /**
   * Initialize session lifecycle tracking
   * @returns {Function} Cleanup function
   */
  initSessionTracking() {
    if (this.isInitialized) return () => {};

    this.sessionStartTime = Date.now();
    this.isInitialized = true;
    this.videoMilestonesReported.clear();
    this.hasVideoStarted = false;
    this.imageViewedReported = false;

    this.trackEvent('session_started', {
      referrer: document.referrer || 'direct',
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    });

    const handleVisibilityChange = () => {
      const state = document.visibilityState;
      if (state !== this.lastVisibilityState) {
        this.lastVisibilityState = state;
        this.trackEvent('visibility_change', {
          visibilityState: state,
        });
      }
    };

    const handleBeforeUnload = () => {
      this.flushCurrentPageTime();
      this.trackEvent('session_ended', {
        reason: 'page_unload',
        ...this.getTimeMetrics(),
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      this.isInitialized = false;
    };
  }

  /**
   * Record page visit and compute page dwell times
   * @param {'landing' | 'explore' | 'video'} pageName
   */
  recordPageView(pageName) {
    this.flushCurrentPageTime();
    this.currentPage = pageName;
    this.pageEnterTime = Date.now();

    const eventMap = {
      landing: 'landing_page_viewed',
      explore: 'explore_page_viewed',
      video: 'video_page_viewed',
    };

    const eventName = eventMap[pageName] || `${pageName}_page_viewed`;
    this.trackEvent(eventName, {
      activePage: pageName,
    });
  }

  /**
   * Internal helper to commit time spent on the active page
   */
  flushCurrentPageTime() {
    if (this.currentPage && this.pageEnterTime && this.timeSpent[this.currentPage] !== undefined) {
      const elapsed = Math.max(0, Math.floor((Date.now() - this.pageEnterTime) / 1000));
      this.timeSpent[this.currentPage] += elapsed;
      this.pageEnterTime = Date.now();
    }
  }

  /**
   * Track when the poster image scrolls into view
   */
  trackImageViewed() {
    if (!this.imageViewedReported) {
      this.imageViewedReported = true;
      this.trackEvent('image_viewed', {
        section: 'scroll_poster_showcase',
      });
    }
  }

  /**
   * Track when the user clicks the poster image to navigate to /explore
   */
  trackImageClicked() {
    this.trackEvent('image_clicked', {
      destination: '/explore',
    });
  }

  /**
   * Track when the user clicks the "PLAY VIDEO" button on /explore
   */
  trackVideoButtonClicked() {
    this.trackEvent('video_button_clicked', {
      destination: '/video',
    });
  }

  /**
   * Track when video playback starts
   */
  trackVideoStarted(extraData = {}) {
    if (!this.hasVideoStarted) {
      this.hasVideoStarted = true;
      this.trackEvent('video_started', {
        ...extraData,
      });
    }
  }

  /**
   * Track video completion milestones (25%, 50%, 75%)
   * @param {number} currentTime
   * @param {number} duration
   */
  trackVideoProgress(currentTime, duration) {
    if (!duration || duration <= 0) return;

    const percent = Math.floor((currentTime / duration) * 100);
    const milestones = [25, 50, 75];

    milestones.forEach((m) => {
      if (percent >= m && !this.videoMilestonesReported.has(m)) {
        this.videoMilestonesReported.add(m);
        this.trackEvent('video_progress', {
          milestonePercent: m,
          currentTimeSeconds: Math.round(currentTime * 10) / 10,
          totalDurationSeconds: Math.round(duration * 10) / 10,
        });
      }
    });
  }

  /**
   * Track when video playback reaches the end
   */
  trackVideoCompleted(extraData = {}) {
    this.videoMilestonesReported.add(100);
    this.trackEvent('video_completed', {
      ...extraData,
    });
  }

  /**
   * Explicitly end session
   * @param {string} [reason='user_action']
   */
  endSession(reason = 'user_action') {
    this.flushCurrentPageTime();
    this.trackEvent('session_ended', {
      reason,
      ...this.getTimeMetrics(),
    });
  }
}

const analytics = new AnalyticsService();
export default analytics;
