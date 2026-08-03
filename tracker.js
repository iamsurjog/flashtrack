let currentPayload = null;

export function initTracker(options = {}) {
  currentPayload = {
    url: window.location.href,
    referrer: document.referrer || 'Direct',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timestamp: new Date().toISOString(),
    ...options
  };

  console.log('📊 [Analytics Tracker Initialized]:', currentPayload);
  
  // Return the payload immediately so caller gets access right away
  return currentPayload;
}

// Optional helper function to retrieve the current payload anytime later
export function getPayload() {
  return currentPayload;
}
