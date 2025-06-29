import React, { useState, FC, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Paper, Stack } from '@mui/material';
import Navbar from '@/components/Navbar';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Verify: FC = () => {
    const [isClient, setIsClient] = useState(false);
    const [idToCheck, setIdToCheck] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<'verified' | 'not_verified' | null>(null);

    // Ganti nama state agar tidak bentrok
    const [apiError, setApiError] = useState<string | null>(null); 

    useEffect(() => { setIsClient(true) }, []);

    const handleCheckStatus = () => {
        if (!idToCheck) return;
        setIsLoading(true);
        setResult(null);
        setApiError(null); // Reset error setiap kali pengecekan baru
        
        // Simulasi panggilan API
        setTimeout(() => {
            try {
                 // Simulasi hasil acak
                if (Math.random() > 0.5) {
                    setResult('verified');
                } else {
                    setResult('not_verified');
                }
            } catch (err) {
                // Perbaiki error 'any' dengan tidak men-tipe 'err'
                setApiError('An unexpected error occurred during check.');
            } finally {
                setIsLoading(false);
            }
        }, 2000);
    };

    if (!isClient) return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Head>
                <title>Check Verification Status - BlockID</title>
            </Head>
            <Navbar />
            <Container component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={8} sx={{ p: 4, width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Check Verification Status
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Enter a wallet address or BlockID hash to check its verification status.
                    </Typography>
                    <Stack spacing={2} direction="column">
                        <TextField 
                            fullWidth 
                            label="Enter ID/Hash/Token" 
                            value={idToCheck}
                            onChange={(e) => setIdToCheck(e.target.value)}
                        />
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleCheckStatus}
                            disabled={isLoading || !idToCheck}
                        >
                            {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Check Status'}
                        </Button>
                    </Stack>

                    {apiError && <Alert severity="error" sx={{mt: 2}}>{apiError}</Alert>}

                    {result && (
                        <Box mt={4}>
                            {result === 'verified' ? (
                                <Alert severity="success" icon={<CheckCircleOutlineIcon />} variant="filled">
                                    This ID is Verified.
                                </Alert>
                            ) : (
                                <Alert severity="error" icon={<HelpOutlineIcon />} variant="filled">
                                    This ID is Not Verified.
                                </Alert>
                            )}
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Verify;
