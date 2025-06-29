import '@/styles/globals.css'; // Path ini sekarang akan berfungsi
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WagmiConfig } from 'wagmi';
import { config as wagmiConfig } from '@/wagmi'; // Path ini juga akan berfungsi
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ... sisa kode tetap sama
const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}