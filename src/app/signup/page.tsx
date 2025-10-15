/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [otp, setOTP] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleSignup = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const { data, error } = await authClient.signUp.email(
  //       {
  //         email, // user email address
  //         password, // user password -> min 8 characters by default
  //         name, // user display name
  //         // callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
  //       },
  //       {
  //         onRequest: (ctx) => {
  //           //show loading
  //         },
  //         onSuccess: (ctx) => {
  //           //redirect to the dashboard or sign in page
  //         },
  //         onError: (ctx) => {
  //           // display the error message
  //           alert(ctx.error.message);
  //         },
  //       }
  //     );
  //   } catch (err: any) {
  //     setError(err.message || "Signup failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSentOtp = async (event: FormEvent) => {
    event.preventDefault();
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: email, // required
      type: "sign-in", // required
    });
    if (!error) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const { data, error } = await authClient.signIn.emailOtp({
      email: email, // required
      otp: String(otp), // required
      fetchOptions: {
        onSuccess: () => {
          // router.push("/dashboard");
          // console.log(data)
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    });
    if (data?.user?.id) {
      await authClient.updateUser({
        name: name,
        fetchOptions: {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          },
        },
      });
    }
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={otpSent ? handleVerifyOtp : handleSentOtp}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
            disabled={otpSent}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email or Phone Number</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="email@example.com or +1234567890"
            required
            disabled={otpSent}
          />
        </div>

        {otpSent && (
          <div className="mb-4">
            <label className="block mb-2">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="OTP"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : otpSent ? "Verify Otp" : "Sent Otp"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <a href="/singin" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
