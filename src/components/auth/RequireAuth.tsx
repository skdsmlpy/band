"use client";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for the store to hydrate from localStorage/cookies
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!token) {
        router.replace("/login");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token) return null;
  return <>{children}</>;
}
