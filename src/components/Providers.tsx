import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { VerifyTonProvider } from "./VerifyTonProvider.tsx";
import { UiLoader } from "./UiLoader.tsx";
import { ToastProvider } from "./kit/Toast/Toast.tsx";
import { ThemeProvider } from "../context/ThemeProvider/ThemeProvider.tsx";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ThemeProvider>
          <TonConnectUIProvider
            manifestUrl={`${
              import.meta.env.VITE_APP_URL
            }/tonconnect-manifest.json`}
          >
            <VerifyTonProvider />
            <UiLoader>{children}</UiLoader>
          </TonConnectUIProvider>
        </ThemeProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
