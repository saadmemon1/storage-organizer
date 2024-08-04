// Use the useRouter hook for routing
"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SignInPage from './signin/page';
import LandingPage from './landing/page';
import Home from './storage-org/page';

const Page = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
  };
  if (!isSignedIn) {
    return <SignInPage onSignInSuccess={handleSignInSuccess} />;
  }

  return <StorageOrgPage />;

};

export default Page;
