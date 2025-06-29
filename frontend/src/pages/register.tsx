import { useState, ChangeEvent, FormEvent, FC } from 'react'; // Impor FC untuk tipe komponen
import Head from 'next/head';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Impor ABI menggunakan path alias yang benar
import contractABI from '@/utils/SoulboundIdentity.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`; // Type assertion

// Definisikan tipe untuk status
interface Status {
  loading: boolean;
  error: string;
  success: string;
}

const Register: FC = () => {
  // Tambahkan tipe untuk setiap state
  const [fullName, setFullName] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ loading: false, error: '', success: '' });
  const [tokenUri, setTokenUri] = useState<string>('');

  const { address, isConnected } = useAccount();

  // --- WAGMI Hooks dengan sintaks terbaru v2/v3 ---
  const { data: hash, error: writeContractError, isPending: isMinting, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
  });


  // Tambahkan tipe untuk event handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaceImage(e.target.files[0]);
    }
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!faceImage || !fullName || !nik) {
      setStatus({ ...status, error: 'Please fill all fields and upload an image.' });
      return;
    }
    
    setStatus({ loading: true, error: '', success: '' });

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('nik', nik);
    formData.append('faceImage', faceImage);

    try {
      const response = await axios.post<{ tokenUri: string }>(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ loading: false, error: '', success: 'Face verification successful! Ready to mint.' });
      setTokenUri(response.data.tokenUri);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      setStatus({ loading: false, error: errorMessage, success: '' });
      setTokenUri('');
    }
  };
  
  const handleMint = () => {
    if (tokenUri && address) {
        writeContract({
            address: contractAddress,
            abi: contractABI.abi,
            functionName: 'safeMint',
            args: [address, tokenUri],
        });
    }
  };

  return (
    <div>
      <Head>
        <title>Register Identity - BlockID</title>
      </Head>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register Identity
        </Typography>

        {!isConnected ? (
          <Alert severity="warning">Please connect your wallet to register.</Alert>
        ) : isConfirmed ? (
           <Alert severity="success">Congratulations! Your identity NFT has been successfully minted. Tx: {hash}</Alert>
        ) : (
          <Box component="form" onSubmit={handleVerify} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="fullName" label="Full Name" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <TextField margin="normal" required fullWidth name="nik" label="NIK/Student ID" id="nik" value={nik} onChange={(e) => setNik(e.target.value)} />
            <Button variant="contained" component="label" fullWidth sx={{ mt: 2, mb: 2 }}>
              Upload Face Scan
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {faceImage && <Typography variant="body2">{faceImage.name}</Typography>}
            {status.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', my: 2 }} />}
            {status.error && <Alert severity="error" sx={{ my: 2 }}>{status.error}</Alert>}
            {status.success && <Alert severity="success" sx={{ my: 2 }}>{status.success}</Alert>}

            {!tokenUri && (<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={status.loading}>Verify Face</Button>)}
            
            {tokenUri && !isMinting && (
                <Button onClick={handleMint} fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2 }} disabled={isConfirming}>
                    {isConfirming ? 'Minting...' : 'Mint Your Identity NFT'}
                </Button>
            )}

            {isMinting && <Alert severity="info" sx={{my: 2}}>Minting in progress... Please check your wallet.</Alert>}
            {isConfirming && <Alert severity="info" sx={{my: 2}}>Transaction sent! Waiting for confirmation...</Alert>}
            {writeContractError && <Alert severity="error" sx={{ my: 2 }}>Transaction failed: {writeContractError.message}</Alert>}
          </Box>
        )}
      </Container>
    </div>
  );
}

export default Register;

