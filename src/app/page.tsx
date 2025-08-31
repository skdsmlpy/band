"use client";
import { useAppSelector } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => !!s.auth.token);

  useEffect(() => {
    router.replace(isAuthenticated ? "/landing" : "/login");
  }, [isAuthenticated, router]);

  return null;
}
