import { useState, ChangeEvent, FormEvent, FC, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Paper, Stack, AlertTitle } from '@mui/material';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useAccount } from 'wagmi';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface Status { loading: boolean; error: string; success: string; }
interface MintStatus { loading: boolean; error: string; success: boolean; txHash: string; }

const Register: FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [fullName, setFullName] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<Status>({ loading: false, error: '', success: '' });
  const [tokenUri, setTokenUri] = useState<string>('');
  const [mintStatus, setMintStatus] = useState<MintStatus>({ loading: false, error: '', success: false, txHash: '' });
  const { address, isConnected } = useAccount();

  useEffect(() => { setIsClient(true) }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { setFaceImage(e.target.files[0]); }
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    // ... (logika handleVerify tetap sama)
  };
  
  const handleMint = async () => {
    // ... (logika handleMint tetap sama)
  };

  if (!isClient) return null;

  return (
    <div>
      <Head>
        <title>Register Identity - BlockID</title>
      </Head>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 } }}>
        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register Identity
          </Typography>
          {!isConnected ? (
            <Alert severity="warning">Please connect your wallet to begin the registration process.</Alert>
          ) : mintStatus.success ? (
            <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="inherit" />}>
              <AlertTitle>Success</AlertTitle>
              Congratulations! Your identity NFT has been successfully minted.
              <br/>
              Transaction Hash: <strong>{mintStatus.txHash}</strong>
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleVerify} noValidate sx={{ mt: 3 }}>
              <Stack spacing={2}>
                <TextField required fullWidth id="fullName" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <TextField required fullWidth label="NIK/Student ID" value={nik} onChange={(e) => setNik(e.target.value)} />
                <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}>
                  {faceImage ? faceImage.name : 'Upload Face Scan'}
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </Button>
                
                {verifyStatus.error && <Alert severity="error">{verifyStatus.error}</Alert>}
                {verifyStatus.success && <Alert severity="success">{verifyStatus.success}</Alert>}
                {mintStatus.error && <Alert severity="error">{mintStatus.error}</Alert>}

                {!tokenUri && (
                    <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5 }} disabled={verifyStatus.loading}>
                        {verifyStatus.loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Face'}
                    </Button>
                )}
                
                {tokenUri && (
                    <Button onClick={handleMint} fullWidth variant="contained" color="secondary" size="large" sx={{ py: 1.5 }} disabled={mintStatus.loading}>
                        {mintStatus.loading ? <CircularProgress size={24} color="inherit" /> : 'Mint Your Identity NFT'}
                    </Button>
                )}
              </Stack>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Register;
