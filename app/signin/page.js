"use client";

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore, GoogleAuthProvider } from '../../firebase';
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { initializeStorage } from '../storage-org/page';
import { Button, Card, CardContent, Typography, Box, Container } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const SignInButton = () => {
    const router = useRouter();
    const provider = new GoogleAuthProvider();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        if (!executeRecaptcha) {
            setError('reCAPTCHA not available. Please try again later.');
            return;
        }
    
        setIsLoading(true);
        setError('');
    
        try {
            const recaptchaResponse = await fetch('/api/verify-recaptcha', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
        
            if (!recaptchaResponse.ok) {
                throw new Error(`HTTP error! status: ${recaptchaResponse.status}`);
            }
        
            const recaptchaData = await recaptchaResponse.json();
        
            if (!recaptchaData.success) {
                throw new Error('reCAPTCHA verification failed. Please try again.');
            }
    
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userRef = doc(firestore, "users", user.uid);
    
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                lastLogin: new Date()
            }, { merge: true });
    
            await initializeStorage(user.uid);
    
            console.log("User signed in");
            router.push('/storage-org');
        } catch (error) {
            console.error('Error signing in:', error);
            setError(error.message || 'An error occurred during sign-in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleSignIn}
                disabled={isLoading}
                sx={{ textTransform: 'none', justifyContent: 'flex-start', padding: '10px 20px' }}
            >
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </>
    );
};

const SignInPage = () => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            <Container component="main" maxWidth="xs">
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                                Sign in to Storage Organizer
                            </Typography>
                            <SignInButton />
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </GoogleReCaptchaProvider>
    );
};


export default SignInPage;
