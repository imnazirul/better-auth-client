"use client";
import { ProtectedRoute } from "@/components/auth-provider";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin"); // redirect to login page
        },
      },
    });
  };
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>This is a protected page</p>
      </div>
      <button
        className="px-2 py-1 rounded border border-white"
        onClick={() => handleLogout()}
      >
        Logout
      </button>
    </ProtectedRoute>
  );
}
