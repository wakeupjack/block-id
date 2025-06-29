import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        // Menambahkan gambar latar belakang
        backgroundImage: 'url(https://images.unsplash.com/photo-1599665640348-83e601525418?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=6400)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}>
      <Head>
        <title>BlockID - Protect Your Identity with Blockchain</title>
        <meta name="description" content="Secure, fast, and without third parties." />
      </Head>
      <Navbar />
      <Container 
        component="main" 
        maxWidth="md" 
        sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        }}
      >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 800,
              letterSpacing: '-1px',
              textShadow: '0px 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            Protect your identity with Blockchain technology.
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: '600px', my: 3 }}>
            Secure, fast, and without third parties. BlockID is a decentralized platform designed to secure and manage digital identities independently.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" size="large" component={Link} href="/register">
              Register
            </Button>
            <Button variant="outlined" size="large" component={Link} href="/verify">
              Verify
            </Button>
          </Stack>
      </Container>
    </Box>
  );
}

export default Home;
