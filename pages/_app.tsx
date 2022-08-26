import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextSeo } from "next-seo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="DraftOrders"
        titleTemplate="DraftOrders"
        defaultTitle="DraftOrders"
        description="Generate your fantasy league's draft order, with a little fanfare."
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
