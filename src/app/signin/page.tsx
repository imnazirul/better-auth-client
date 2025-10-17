/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type AuthMethod = "otp" | "password" | null;

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState<any>("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async () => {
    const data = await authClient.signIn.social({
      requestSignUp: false,
      provider: "google",
      callbackURL: "http://localhost:3000/dashboard",
      fetchOptions: {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    });
    console.log(data);
  };

  const handleSentOtp = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: email, // required
        type: "sign-in", // required
      });
      if (!error) {
        setOtpSent(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      console.log(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFetchUsers = async () => {
    const data = await fetch("http://localhost:5000/api/users", {
      credentials: "include",
    });
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={otpSent ? handleVerifyOtp : handleSentOtp}>
        <div className="mb-4">
          <label className="block mb-2">Email or Phone Number</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="email@example.com"
            required
            // disabled={otpSent}
          />
        </div>
        {otpSent && (
          <div className="mb-4">
            <label className="block mb-2">OTP</label>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="OTP"
              required
              // disabled={otpSent}
            />
          </div>
        )}

        <button className="px-2 py-1 rounded border border-white">
          {loading ? "Processing.." : otpSent ? "Verify Otp" : "Sent Otp"}
        </button>
      </form>

      {/* Social Login */}
      <div className="mt-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => signIn()}
            className="flex items-center justify-center cursor-pointer px-4 py-2 border rounded hover:bg-gray-50 hover:text-gray-700"
          >
            Google
          </button>
          <button
            // onClick={() => handleSocialLogin("apple")}
            className="flex items-center justify-center cursor-pointer px-4 py-2 hover:text-gray-700 border rounded hover:bg-gray-50"
          >
            Apple
          </button>
        </div>
      </div>
      {/* <button
        onClick={() => {
          handleFetchUsers();
        }}
      >
        Get User
      </button> */}

      <p className="mt-6 text-center text-sm">
        {"Don't"} have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
