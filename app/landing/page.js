"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Container, Box } from '@mui/material';

const LandingPage = () => {
    const router = useRouter();
    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={5}>
                <Typography variant="h2" gutterBottom>
                    Welcome to Storage Organizer
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Ready to experience the next level of organization? Get all your storage needs sorted with ease and efficiency!
                </Typography>
                <Button variant="contained" color="primary" onClick={() => router.push('/signin')}>
                    Get Started
                </Button>
            </Box>
        </Container>
    );
};

export default LandingPage;
