import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WagmiProvider } from 'wagmi';
import { config as wagmiConfig } from '@/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import theme from '@/theme'; // <-- Impor tema kustom Anda

// Versi final dari _app.tsx yang mengintegrasikan semua perbaikan dan tema
export default function App({ Component, pageProps }: AppProps) {
  // Gunakan React.useState untuk memastikan QueryClient hanya dibuat sekali
  // di sisi klien, yang mencegah masalah dengan re-rendering.
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}> 
      <QueryClientProvider client={queryClient}>
        {/* Gunakan ThemeProvider dengan tema kustom Anda yang sudah diimpor */}
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Mereset CSS dan menerapkan warna latar belakang dari tema */}
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
