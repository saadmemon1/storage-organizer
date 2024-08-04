import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase'; // Adjust path as necessary
import { useRouter } from 'next/navigation';

const SignInPage = () => {
    const router = useRouter();
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed in");
      // Update sign-in state here if needed
      router.push('/storage-org');
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
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
