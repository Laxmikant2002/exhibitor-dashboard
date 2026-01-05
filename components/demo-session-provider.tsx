"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check demo session on protected routes
    if (pathname?.startsWith("/protected")) {
      const demoSession = localStorage.getItem("demo_session");
      
      if (demoSession) {
        try {
          const session = JSON.parse(demoSession);
          // Check if session expired
          if (Date.now() > session.expires_at) {
            localStorage.removeItem("demo_session");
            router.push("/auth/login");
          }
        } catch (error) {
          localStorage.removeItem("demo_session");
          router.push("/auth/login");
        }
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
