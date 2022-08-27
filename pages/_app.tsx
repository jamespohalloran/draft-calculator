import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextSeo } from "next-seo";
import Head from "next/head";

const NEXT_PUBLIC_GOOGLE_ANALYTICS = "G-XM9GQWSBL0";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <NextSeo
        title="DraftOrders"
        titleTemplate="DraftOrders"
        defaultTitle="DraftOrders"
        description="Randomly Generate your Fantasy League's Draft Order, With a Little Fanfare."
        canonical="https://www.draftorders.com/"
        openGraph={{
          url: "https://www.draftorders.com/",
          title: "DraftOrders.com",
          description: "Generate your draft order, with a little fanfare.",
          images: [
            {
              url: "https://www.draftorders.com/screenshot.png",
              width: 2222,
              height: 1196,
              alt: "DraftOrders.com",
            },
          ],
        }}
      />
      <div data-theme="dark">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
