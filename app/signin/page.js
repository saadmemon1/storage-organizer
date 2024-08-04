"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore, GoogleAuthProvider } from '../../firebase';
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { initializeStorage } from '../storage-org/page';
import { Button, Card, CardContent, Typography, Box, Container } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const SignInPage = () => {
    const router = useRouter();
    const provider = new GoogleAuthProvider();

    const handleSignIn = async () => {
        try {
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
            console.error('Error signing in with Google:', error);
        }
    };

    return (
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
                        <Button
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            onClick={handleSignIn}
                            sx={{ textTransform: 'none', justifyContent: 'flex-start', padding: '10px 20px' }}
                        >
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default SignInPage;
