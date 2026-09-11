import Script from "next/script";

/**
 * GA4 via gtag.js. Page views, including client-side navigations, come from
 * enhanced measurement's history-change page views; sending them here as well
 * would double count.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)}, { allow_google_signals: false, allow_ad_personalization_signals: false });`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
