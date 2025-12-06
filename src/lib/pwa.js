'use client';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function showInstallPrompt() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return false; // Already installed
    }

    // Show install prompt
    return true;
  }
  return false;
}

export function installPWA() {
  if (typeof window !== 'undefined') {
    // This will be handled by the browser's install prompt
    // The prompt is shown automatically when the app meets PWA criteria
    return true;
  }
  return false;
}

