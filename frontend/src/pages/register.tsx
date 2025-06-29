import { useState, ChangeEvent, FormEvent, FC, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Paper, Stack, AlertTitle } from '@mui/material';
import Navbar from '@/components/Navbar';
import { useAccount } from 'wagmi';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
  const { isConnected } = useAccount();

  useEffect(() => { setIsClient(true) }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { setFaceImage(e.target.files[0]); }
  };

  const handleVerify = async (_e: FormEvent<HTMLFormElement>) => {
    _e.preventDefault();
    
    if (!fullName || !nik || !faceImage) {
      setVerifyStatus({ loading: false, error: 'Please fill all fields and upload face image', success: '' });
      return;
    }

    setVerifyStatus({ loading: true, error: '', success: '' });

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification
      setVerifyStatus({ loading: false, error: '', success: 'Face verification completed successfully!' });
      setTokenUri('https://example.com/token-uri'); // Mock token URI
    } catch (error) {
      setVerifyStatus({ loading: false, error: 'Verification failed. Please try again.', success: '' });
    }
  };
  
  const handleMint = async () => {
    if (!tokenUri) {
      setMintStatus({ loading: false, error: 'Please complete verification first', success: false, txHash: '' });
      return;
    }

    setMintStatus({ loading: true, error: '', success: false, txHash: '' });

    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful minting
      const mockTxHash = '0x' + Math.random().toString(16).slice(2, 66);
      setMintStatus({ loading: false, error: '', success: true, txHash: mockTxHash });
    } catch (error) {
      setMintStatus({ loading: false, error: 'Minting failed. Please try again.', success: false, txHash: '' });
    }
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