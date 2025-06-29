import { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Checkbox, FormControlLabel } from '@mui/material';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAccount } from 'wagmi';
import React from 'react';

// Definisikan tipe untuk hasil verifikasi
interface VerificationResult {
  isVerified: boolean;
}

// Definisikan tipe untuk status
interface Status {
  loading: boolean;
  error: string;
  result: VerificationResult | null;
}

const Verify: React.FC = () => {
  const [addressToCheck, setAddressToCheck] = useState<string>('');
  const [useMyAddress, setUseMyAddress] = useState<boolean>(true);
  const [status, setStatus] = useState<Status>({ loading: false, error: '', result: null });
  const { address: connectedAddress, isConnected } = useAccount();

  const handleCheck = async () => {
    const finalAddress = useMyAddress ? connectedAddress : addressToCheck;
    if (!finalAddress) {
      setStatus({ ...status, error: 'Please provide a wallet address or connect your wallet.' });
      return;
    }
    setStatus({ loading: true, error: '', result: null });

    try {
      const response = await axios.get<VerificationResult>(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/get-status/${finalAddress}`);
      setStatus({ loading: false, error: '', result: response.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      setStatus({ loading: false, error: errorMessage, result: null });
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUseMyAddress(event.target.checked);
    if(event.target.checked) {
        setAddressToCheck('');
    }
  };

  return (
    <div>
      <Head>
        <title>Check Verification Status - BlockID</title>
      </Head>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Check Verification Status
        </Typography>
        <Box sx={{ mt: 1 }}>
            <FormControlLabel
                control={ <Checkbox checked={useMyAddress} onChange={handleCheckboxChange} disabled={!isConnected} name="useMyAddress" color="primary" /> }
                label="Use my connected wallet address"
            />
          <TextField
            margin="normal" fullWidth id="address" label="Enter Wallet Address" name="address"
            value={useMyAddress ? (connectedAddress || 'Connect your wallet') : addressToCheck}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddressToCheck(e.target.value)}
            disabled={useMyAddress}
          />
          <Button onClick={handleCheck} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={status.loading || (useMyAddress && !isConnected)}>
            Check Status
          </Button>
          {status.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', my: 2 }} />}
          {status.error && <Alert severity="error" sx={{ my: 2 }}>{status.error}</Alert>}
          {status.result && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, flexDirection: 'column' }}>
                <Typography variant="h6">Verification Result:</Typography>
                {status.result.isVerified ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <CheckCircleIcon sx={{ mr: 1 }} />
                        <Typography variant="h5">Verified</Typography>
                    </Box>
                ) : (
                     <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <CancelIcon sx={{ mr: 1 }} />
                        <Typography variant="h5">Not Verified</Typography>
                    </Box>
                )}
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default Verify;