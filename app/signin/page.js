"use client";

import { auth, firestore, GoogleAuthProvider } from '../../firebase'; // Adjust path as necessary
import { useRouter } from 'next/navigation';
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { initializeStorage } from '../storage-org/page';

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
        <div>
            <h1>Sign In</h1>
            <button onClick={handleSignIn}>Sign in with Google</button>
        </div>
    );
};

export default SignInPage;
