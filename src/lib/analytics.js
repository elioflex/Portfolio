const GA_ID = (import.meta.env.VITE_GA_ID || '').trim();

let analyticsInitialized = false;

export function initAnalytics() {
  if (typeof window === 'undefined' || !GA_ID || analyticsInitialized) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const existingScript = document.querySelector(`script[data-ga-id="${GA_ID}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.setAttribute('data-ga-id', GA_ID);
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    anonymize_ip: true,
    send_page_view: false,
  });

  analyticsInitialized = true;
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || !GA_ID) {
    return;
  }

  if (!window.gtag) {
    initAnalytics();
  }

  window.gtag?.('event', name, params);
}

export function trackPageView(pagePath) {
  if (typeof window === 'undefined' || !GA_ID) {
    return;
  }

  if (!window.gtag) {
    initAnalytics();
  }

  const path = pagePath || `${window.location.pathname}${window.location.search}`;
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

