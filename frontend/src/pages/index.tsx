import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Button } from '@mui/material';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>BlockID - Decentralized Identity</title>
        <meta name="description" content="Verify your identity on the blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to BlockID
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            A secure and decentralized way to manage your digital identity using Soulbound NFTs.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Link href="/register" passHref>
              <Button variant="contained" size="large" sx={{ mr: 2 }}>
                Register Your Identity
              </Button>
            </Link>
            <Link href="/verify" passHref>
              <Button variant="outlined" size="large">
                Check Verification Status
              </Button>
            </Link>
          </Box>
        </Container>
      </main>
    </div>
  );
}

export default Home;