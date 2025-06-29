import React, { useState, useEffect } from 'react'; // Impor useState dan useEffect
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Link from 'next/link';

const Navbar: React.FC = () => {
  // State untuk memastikan komponen hanya dirender di sisi klien
  const [isClient, setIsClient] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Jalankan hanya sekali di sisi klien setelah komponen dimuat
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = () => {
    // Hubungkan ke connector injected (MetaMask) jika tersedia
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            BlockID
          </Link>
        </Typography>
        <Box sx={{ '& button': { ml: 1 } }}>
          <Link href="/register" passHref>
            <Button color="inherit">Register</Button>
          </Link>
          <Link href="/verify" passHref>
            <Button color="inherit">Verify</Button>
          </Link>
          
          {/* Bungkus tombol dinamis agar hanya dirender di klien */}
          {isClient && (
            <>
              {isConnected ? (
                <Button color="secondary" variant="contained" onClick={() => disconnect()}>
                  Disconnect {address && `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                </Button>
              ) : (
                <Button color="secondary" variant="contained" onClick={handleConnect}>
                  Connect Wallet
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
