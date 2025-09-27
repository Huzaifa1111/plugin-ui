"use Client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Get params from URL
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    const accessToken = params.get("accessToken");

    if (shop && accessToken) {
      // Save in localStorage
      localStorage.setItem("shop", shop);
      localStorage.setItem("accessToken", accessToken);

      console.log("Saved credentials:", { shop, accessToken });

      // Redirect to Orders page
      router.push("/orders");
    } else {
      console.error("Missing shop or accessToken in callback URL");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Finalizing authentication...</p>
    </div>
  );
}
