import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

// GET
const fetcher = (url :string) => fetch(url).then(res => res.json()); 

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{refreshInterval: 300000, fetcher }}>
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
