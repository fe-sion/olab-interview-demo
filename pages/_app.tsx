import '../styles/globals.css';
import type { AppProps } from 'next/app';
import * as Sentry from "@sentry/nextjs";
import { WagmiProvider } from '../components/providers/WagmiProvider';

Sentry.init({
  dsn: 'https://54844c73d374e7b66b9bb878089672b7@o4509285430001664.ingest.us.sentry.io/4509285433212928',
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  // Replay may only be enabled for the client-side
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <Component {...pageProps} />
    </WagmiProvider>
  );
}

export default MyApp; 