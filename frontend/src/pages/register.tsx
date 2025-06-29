import { useState, ChangeEvent, FormEvent, FC, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Paper, Stack, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
// Hapus 'axios' karena tidak digunakan dalam logika simulasi
// import axios from 'axios'; 
import { useAccount } from 'wagmi';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Variabel ini tidak digunakan dalam logika saat ini, jadi kita beri komentar
// const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface Status { loading: boolean; error: string; success: string; }
interface MintStatus { loading: boolean; error: string; success: boolean; txHash: string; }

const Register: FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [fullName, setFullName] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [faceImage, setFaceImage] = useState<File | null>(null);
  
  // Ubah nama state agar lebih jelas dan gunakan variabelnya
  const [simulationStatus, setSimulationStatus] = useState<Status>({ loading: false, error: '', success: '' });
  
  // Karena 'setTokenUri' tidak pernah dipakai, kita bisa sederhanakan state ini
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  const [mintStatus, setMintStatus] = useState<MintStatus>({ loading: false, error: '', success: false, txHash: '' });
  const { isConnected } = useAccount(); // Hapus 'address' karena tidak dipakai

  useEffect(() => { setIsClient(true) }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { setFaceImage(e.target.files[0]); }
  };

  // Ubah nama parameter 'e' menjadi '_e' untuk menandakan tidak terpakai
  const handleVerify = async (_e: FormEvent<HTMLFormElement>) => { 
    _e.preventDefault();
    setSimulationStatus({ loading: true, error: '', success: '' });
    // Simulasi sukses
    setTimeout(() => {
        setSimulationStatus({ loading: false, error: '', success: 'Verification successful!' });
        setIsVerified(true);
    }, 2000);
  };
  
  const handleMint = async () => {
    setMintStatus({loading: true, error: '', success: false, txHash: ''})
     // Simulasi sukses
    setTimeout(() => {
        setMintStatus({loading: false, error: '', success: true, txHash: '0x123...abc (Simulated)'});
    }, 2000);
  };

  if (!isClient) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Head>
        <title>Register Identity - BlockID</title>
      </Head>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Register Identity
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Secure your digital identity on the blockchain. Fill in the form to get started.
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={8} sx={{ p: 4, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(30, 30, 30, 0.5)' }}>
                  {!isConnected ? (
                    <Alert severity="info">Please connect your wallet to begin.</Alert>
                  ) : mintStatus.success ? (
                    <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="inherit" />}>
                      Identity Minted! Your unique BlockID is now secure on the blockchain.
                    </Alert>
                  ) : (
                    <Box component="form" onSubmit={handleVerify} noValidate>
                      <Stack spacing={2.5}>
                        <TextField required fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        <TextField required fullWidth label="NIK/Student ID" value={nik} onChange={(e) => setNik(e.target.value)} />
                        <TextField required fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        
                        {simulationStatus.error && <Alert severity="error">{simulationStatus.error}</Alert>}
                        {mintStatus.error && <Alert severity="error">{mintStatus.error}</Alert>}
                        {simulationStatus.success && <Alert severity="info">{simulationStatus.success}</Alert>}

                        <Button 
                            variant="contained" 
                            size="large"
                            // Ganti ke handleMint jika sudah terverifikasi
                            onClick={isVerified ? handleMint : undefined} 
                            // Gunakan tipe 'submit' jika belum terverifikasi
                            type={isVerified ? 'button' : 'submit'}
                            disabled={simulationStatus.loading || mintStatus.loading}
                        >
                            {simulationStatus.loading || mintStatus.loading 
                                ? <CircularProgress size={26} color="inherit" /> 
                                : isVerified ? 'Create My BlockID' : 'Verify Identity'}
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Paper>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Register;
