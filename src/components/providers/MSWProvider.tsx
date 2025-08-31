"use client";
import { useEffect } from "react";

export function MSWProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/mocks/browser").then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }));
    }
  }, []);
  return null;
}
