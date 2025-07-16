import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider
} from '@mui/material';
import { CheckCircleOutline as CheckCircleOutlineIcon, Badge as BadgeIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';

interface BadgeStatus {
  isVerified: boolean;
  isEligibleForBadge: boolean;
  hasMintedBadge: boolean;
  badgeBalance: number;
}

interface BadgeInfo {
  tokenId: string;
  tokenURI: string;
  soulboundReference: string;
}

interface MintStatus {
  loading: boolean;
  error: string;
  success: boolean;
  txHash: string;
}

export default function Badge() {
  const [isClient, setIsClient] = useState(false);
  const [badgeStatus, setBadgeStatus] = useState<BadgeStatus | null>(null);
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo[]>([]);
  const [mintStatus, setMintStatus] = useState<MintStatus>({ loading: false, error: '', success: false, txHash: '' });
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      fetchBadgeStatus();
      fetchBadgeInfo();
    }
  }, [isConnected, address]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBadgeStatus = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/badge/status/${address}`);
      const data = await response.json();
      
      if (response.ok) {
        setBadgeStatus(data);
      } else {
        console.error('Failed to fetch badge status:', data.error);
      }
    } catch (error) {
      console.error('Error fetching badge status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadgeInfo = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/badge/info/${address}`);
      const data = await response.json();
      
      if (response.ok) {
        setBadgeInfo(data.badges || []);
      } else {
        // It's ok if no badges are found
        setBadgeInfo([]);
      }
    } catch (error) {
      console.error('Error fetching badge info:', error);
      setBadgeInfo([]);
    }
  };

  const handleMintBadge = async () => {
    if (!address) return;
    
    setMintStatus({ loading: true, error: '', success: false, txHash: '' });
    
    try {
      const response = await fetch('http://localhost:5001/api/badge/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // In a real implementation, you would now call the smart contract
        // For now, we'll simulate success
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockTxHash = '0x' + Math.random().toString(16).slice(2, 66);
        
        setMintStatus({ loading: false, error: '', success: true, txHash: mockTxHash });
        
        // Refresh badge status and info
        await fetchBadgeStatus();
        await fetchBadgeInfo();
      } else {
        setMintStatus({ loading: false, error: data.error || 'Failed to mint badge', success: false, txHash: '' });
      }
    } catch (error) {
      setMintStatus({ loading: false, error: 'Network error occurred', success: false, txHash: '' });
    }
  };

  if (!isClient) return null;

  return (
    <div>
      <Head>
        <title>Verification Badge - BlockID</title>
      </Head>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 } }}>
        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            <BadgeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Verification Badge
          </Typography>
          
          {!isConnected ? (
            <Alert severity="warning">
              Please connect your wallet to view your badge status.
            </Alert>
          ) : loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
              {/* Badge Status */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Badge Status
                  </Typography>
                  {badgeStatus && (
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={badgeStatus.isVerified ? 'Verified' : 'Not Verified'}
                          color={badgeStatus.isVerified ? 'success' : 'default'}
                          icon={badgeStatus.isVerified ? <CheckCircleOutlineIcon /> : undefined}
                        />
                        <Chip
                          label={badgeStatus.hasMintedBadge ? 'Badge Minted' : 'No Badge'}
                          color={badgeStatus.hasMintedBadge ? 'primary' : 'default'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Badge Balance: {badgeStatus.badgeBalance}
                      </Typography>
                    </Stack>
                  )}
                </CardContent>
              </Card>

              {/* Mint Badge Section */}
              {badgeStatus && badgeStatus.isEligibleForBadge && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Mint Your Verification Badge
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Congratulations! You have a verified identity and are eligible to mint a verification badge.
                      This badge can be transferred and showcases your verified status.
                    </Typography>
                    
                    {mintStatus.error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {mintStatus.error}
                      </Alert>
                    )}
                    
                    {mintStatus.success && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        <AlertTitle>Success!</AlertTitle>
                        Your verification badge has been minted successfully.
                        <br />
                        Transaction Hash: <strong>{mintStatus.txHash}</strong>
                      </Alert>
                    )}
                    
                    <Button
                      onClick={handleMintBadge}
                      variant="contained"
                      disabled={mintStatus.loading}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      {mintStatus.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Mint Verification Badge'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Badge Collection */}
              {badgeInfo.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Your Verification Badges
                    </Typography>
                    <Stack spacing={2}>
                      {badgeInfo.map((badge, index) => (
                        <Card key={index} variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              Verification Badge #{badge.tokenId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Token URI: {badge.tokenURI.substring(0, 50)}...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Soulbound Reference: {badge.soulboundReference}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    About Verification Badges
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verification badges are transferable NFTs that represent your verified identity status.
                    Unlike soulbound tokens, these badges can be transferred to other addresses while
                    maintaining the proof of your original identity verification.
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}
        </Paper>
      </Container>
    </div>
  );
}

// badge still error, fix lagi nanti 