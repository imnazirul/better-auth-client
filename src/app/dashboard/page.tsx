/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ProtectedRoute } from "@/components/auth-provider";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [sessionList, setSessionList] = useState<any[]>([]);
  const { data: userSession, isPending } = authClient.useSession();
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState("");
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

  useEffect(() => {
    const fn = async () => {
      try {
        const sessions = await authClient.listSessions();
        console.log(sessions);
        setSessionList(sessions?.data as any);
      } catch (error) {}
    };
    fn();
  }, [refetch]);

  const handleRemove = async (token: string) => {
    try {
      setIsLoading(token);
      const res = await authClient.revokeSession({
        token: token,
      });
      if (!res?.error) {
        setRefetch(!refetch);
      }
    } catch (error) {
    } finally {
      setIsLoading("");
    }
  };

  return (
    <ProtectedRoute>
      <div className="px-7 py-12">
        <div>
          <h1>Dashboard</h1>
          <p>This is a protected page</p>
        </div>
        <div className="px-4 py-2 border rounded-lg my-7">
          <p>Name: {userSession?.user?.name}</p>
          <p>Email: {userSession?.user?.email}</p>
          <p>Id: {userSession?.user?.id}</p>
        </div>
        <button
          className="px-2 py-1 rounded border border-white"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
        <div className=" space-y-4 my-12">
          {sessionList?.map((session, idx) => {
            return (
              <div className="px-4 py-2 border rounded-lg" key={idx}>
                <p>
                  IP Address: {session?.ipAddress}{" "}
                  <span className="text-red-400">
                    {session?.token == userSession?.session?.token
                      ? "This Device"
                      : ""}
                  </span>
                </p>
                <p>User Agent: {session?.userAgent}</p>
                <p>Token: {session?.token}</p>
                {/* <p>Expires At: {session?.expiresAt}</p>
            <p>Created At: {session?.createdAt}</p>
            <p>Updated At: {session?.updatedAt}</p> */}
                <button
                  className="border border-red-500 text-red-500 px-4 py-1.5 rounded"
                  onClick={() => handleRemove(session?.token)}
                >
                  {isLoading && isLoading == session?.token
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
