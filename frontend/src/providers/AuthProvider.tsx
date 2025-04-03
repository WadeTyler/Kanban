'use client';
import React, {useEffect} from 'react';
import {LOGIN_URL} from "@/environment";
import useAuthStore from "@/stores/auth.store";
import {useRouter} from "next/navigation";

type AuthProviderType = {
  children: React.ReactNode;
  authRequired?: boolean;
  redirectTo?: string;
}

const AuthProvider = ({children, authRequired = true, redirectTo = LOGIN_URL}: AuthProviderType) => {
  // Navigation
  const router = useRouter();


  // Auth Store
  const {user, isLoadingUser, loadUser} = useAuthStore();

  useEffect(() => {
    if (!user && !isLoadingUser) {
      loadUser();
    }
  }, [loadUser]);

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  // If auth required and no user found and not loading redirect to redirectTo
  if (authRequired && !isLoadingUser && !user) {
    router.push(redirectTo || "/");
  }

  return (
    <>
      {children}
    </>
  )
};

export default AuthProvider;