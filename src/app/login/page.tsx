"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import api from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("No credential received from Google.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/api/auth/google", { idToken });
      setToken(data.token);
      setUser(data.user);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="text-4xl mb-3">💒</div>
          <h1 className="text-2xl font-bold text-gray-800">Wedding Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in with your authorised Google account
          </p>
        </div>

        {error && (
          <div className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-gray-400 animate-pulse">
            Signing in...
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError("Google sign-in failed. Please try again.")}
            useOneTap
            shape="rectangular"
            size="large"
            width="240"
          />
        )}
      </div>
    </div>
  );
}
