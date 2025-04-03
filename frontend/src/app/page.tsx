'use client';
import useAuthStore from "@/stores/auth.store";
import {LOGOUT_URL, LOGIN_URL} from "@/environment";
import AuthProvider from "@/providers/AuthProvider";

export default function Home() {

  const {user} = useAuthStore();

  return (
    <AuthProvider authRequired={false}>
      <div>
        {!user && <a href={LOGIN_URL}>Login</a>}
        {user && (
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>ID: {user.userId}</p>
            <img src={user.picture} alt="User Profile Picture"/>

            <a href={LOGOUT_URL}>Logout</a>
          </div>
        )}

      </div>
    </AuthProvider>
  );
}
