"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    // Clear demo session from localStorage
    localStorage.removeItem("demo_session");
    
    // Clear demo session cookie
    document.cookie = "demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Clear Supabase session
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <button
      onClick={logout}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
    >
      Logout
    </button>
  );
}
