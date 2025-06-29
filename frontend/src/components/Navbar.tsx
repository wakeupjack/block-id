import React, { useState, useEffect } from 'react';
// Hapus 'Box' dari sini karena tidak terpakai
import { AppBar, Toolbar, Typography, Button, Stack, Chip } from '@mui/material'; 
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Link from 'next/link';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Navbar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => { setIsClient(true) }, []);

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) { connect({ connector: injectedConnector }); }
  };

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1} component={Link} href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <FingerprintIcon color="primary" />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                BlockID
            </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Button component={Link} href="/" color="inherit">Home</Button>
          
          {isClient && (
            <>
              {isConnected ? (
                <Chip
                  icon={<AccountBalanceWalletIcon />}
                  label={`${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
                  onDelete={() => disconnect()}
                  color="primary"
                  variant="outlined"
                />
              ) : (
                <>
                    <Button variant="outlined" color="primary" component={Link} href="/register">Register</Button>
                    <Button variant="contained" color="primary" onClick={handleConnect}>
                        Connect Wallet
                    </Button>
                </>
              )}
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
