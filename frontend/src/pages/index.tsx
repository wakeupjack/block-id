import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Stack, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Avatar,
  Fade,
  Grow,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Security, 
  Speed, 
  VerifiedUser, 
  Public, 
  Shield, 
  Lock,
  Visibility,
  Group,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Decentralized Security",
      description: "Your identity is secured by blockchain technology, eliminating single points of failure."
    },
    {
      icon: <Lock sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: "Zero-Knowledge Proof",
      description: "Verify your identity without revealing personal information to third parties."
    },
    {
      icon: <Group sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      title: "Self-Sovereign Identity",
      description: "You own and control your digital identity completely."
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: "Instant Verification",
      description: "Fast, real-time identity verification across multiple platforms."
    }
  ];

  const stats = [
    { number: "100K+", label: "Identities Secured", icon: <VerifiedUser /> },
    { number: "99.9%", label: "Uptime", icon: <CheckCircle /> },
    { number: "50+", label: "Partner Platforms", icon: <Public /> },
    { number: "24/7", label: "Support", icon: <Shield /> }
  ];

  const steps = [
    {
      step: "01",
      title: "Register Your Identity",
      description: "Create your decentralized identity using secure biometric authentication"
    },
    {
      step: "02",
      title: "Secure on Blockchain",
      description: "Your identity is encrypted and stored on the blockchain network"
    },
    {
      step: "03",
      title: "Verify Anywhere",
      description: "Use your BlockID across multiple platforms without compromising privacy"
    }
  ];

  return (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
    }}>
      <Head>
        <title>BlockID - Protect Your Identity with Blockchain</title>
        <meta name="description" content="Secure, fast, and without third parties." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Animated Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.1)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.1)} 50%, 
              ${alpha(theme.palette.info.main, 0.1)} 100%
            ),
            url('https://images.unsplash.com/photo-1639322537504-6427a16b0a28?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=6400')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -2,
        }}
      />

      {/* Overlay for better text readability */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: -1,
        }}
      />

      {/* Floating Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          left: '10%',
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          zIndex: -1,
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          bottom: '20%',
          right: '10%',
          width: 150,
          height: 150,
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: -1,
        }}
      />

      <Navbar />

      {/* Hero Section */}
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            py: { xs: 6, sm: 8, md: 10 },
            minHeight: '100vh',
        }}
      >
        <Fade in={isVisible} timeout={1000}>
          <Box sx={{ maxWidth: '900px', width: '100%' }}>
            {/* <Chip 
              label="" 
              sx={{ 
                mb: 4,
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.light,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                fontWeight: 600,
                px: 3,
                py: 1.5,
                fontSize: '0.9rem',
              }}
            /> */}
            
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 800,
                letterSpacing: '-2px',
                textShadow: '0px 4px 20px rgba(0,0,0,0.5)',
                background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.light} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                lineHeight: 1.1,
                mb: 4
              }}
            >
              Protect Your Digital Identity
              <br />
              with Blockchain Technology
            </Typography>
            
            <Typography 
              variant="h5" 
              paragraph 
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto',
                mb: 6,
                color: alpha(theme.palette.common.white, 0.9),
                fontWeight: 300,
                lineHeight: 1.6,
                textShadow: '0px 2px 10px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
              }}
            >
              Secure, fast, and without third parties. BlockID is a decentralized platform designed to secure and manage digital identities independently.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              sx={{ 
                mb: 8,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                href="/register"
                endIcon={<ArrowForward />}
                sx={{
                  py: 2.5,
                  px: 5,
                  borderRadius: 3,
                  minWidth: 200,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0px 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0px 12px 35px ${alpha(theme.palette.primary.main, 0.5)}`,
                  }
                }}
              >
                Register Now
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                href="/verify"
                sx={{
                  py: 2.5,
                  px: 5,
                  borderRadius: 3,
                  minWidth: 200,
                  borderColor: alpha(theme.palette.common.white, 0.3),
                  color: theme.palette.common.white,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: alpha(theme.palette.common.white, 0.7),
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Verify Identity
              </Button>
            </Stack>
          </Box>
        </Fade>

        {/* Stats Section */}
        <Grow in={isVisible} timeout={1500}>
          <Box sx={{ width: '100%', maxWidth: '1000px' }}>
            <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      textAlign: 'center',
                      background: alpha(theme.palette.common.white, 0.05),
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        background: alpha(theme.palette.common.white, 0.1),
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        color: theme.palette.primary.light,
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        mb: 2
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: theme.palette.common.white, 
                        mb: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: alpha(theme.palette.common.white, 0.7),
                        fontSize: { xs: '0.8rem', sm: '0.9rem' }
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.common.white,
              mb: 3,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Why Choose BlockID?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: alpha(theme.palette.common.white, 0.8),
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            Experience the future of digital identity with our cutting-edge blockchain technology
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Grow in={isVisible} timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    background: alpha(theme.palette.common.white, 0.05),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      background: alpha(theme.palette.common.white, 0.1),
                      boxShadow: `0px 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.common.white, 
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: alpha(theme.palette.common.white, 0.7),
                        textAlign: 'center',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 10 }, background: alpha(theme.palette.common.white, 0.02) }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.common.white,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              How BlockID Works
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.8),
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}
            >
              Simple, secure, and straightforward process to protect your digital identity
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in={isVisible} timeout={1500 + index * 300}>
                  <Box sx={{ 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Avatar
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        mb: 3,
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        fontWeight: 700
                      }}
                    >
                      {step.step}
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.common.white, 
                        mb: 2,
                        fontSize: { xs: '1.3rem', sm: '1.5rem' }
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: alpha(theme.palette.common.white, 0.7),
                        lineHeight: 1.6,
                        maxWidth: '300px'
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Grow in={isVisible} timeout={2000}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: 'center',
              background: alpha(theme.palette.common.white, 0.05),
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.common.white,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem' }
              }}
            >
              Ready to Secure Your Digital Future?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.8),
                mb: 6,
                maxWidth: '500px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Join thousands of users who trust BlockID to protect their digital identity. Start your journey today.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              sx={{ 
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  py: 2.5,
                  px: 5,
                  borderRadius: 3,
                  minWidth: 200,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0px 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0px 12px 35px ${alpha(theme.palette.primary.main, 0.5)}`,
                  }
                }}
              >
                Get Started Now
              </Button>
              
              <Button 
                variant="outlined" 
                size="large"
                sx={{
                  py: 2.5,
                  px: 5,
                  borderRadius: 3,
                  minWidth: 200,
                  borderColor: alpha(theme.palette.common.white, 0.3),
                  color: theme.palette.common.white,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: alpha(theme.palette.common.white, 0.7),
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
}

export default Home;