"use client";
import { useState } from 'react';
import LandingPage from './landing/page';
import StorageOrgPage from './storage-org/page';

const Page = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
  };
  if (!isSignedIn) {
    return <LandingPage onSignInSuccess={handleSignInSuccess} />;
  }

  return <StorageOrgPage />;

};

export default Page;
