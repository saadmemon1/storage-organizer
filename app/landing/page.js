"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Container, Box, Link } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100vh', // Full view height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
}));

const LandingPage = () => {
  const router = useRouter();
  return (
    <StyledContainer maxWidth="sm">
      <Box textAlign="center" sx={{ width: '100%' }}>
        <StorageIcon color="primary" sx={{ fontSize: 60, marginBottom: 2 }} />
        <Typography variant="h2" gutterBottom>
          Welcome to Storage Organizer
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Ready to experience the next level of organization? Get all your storage needs sorted with ease and efficiency!
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/signin')} sx={{ marginTop: 3 }}>
          Get Started
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Link href="https://github.com/saadmemon1" target="_blank" color="inherit">
            <GitHubIcon sx={{ fontSize: 40, mx: 2 }} />
          </Link>
          <Link href="https://linkedin.com/in/saadinamm" target="_blank" color="inherit">
            <LinkedInIcon sx={{ fontSize: 40, mx: 2 }} />
          </Link>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default LandingPage;
