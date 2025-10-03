"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Billings() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/membership"); // ✅ takes you to /billings page
  };

  return (
    <div>
      <div className="p-10 mx-5 mb-5 rounded-lg bg-slate-200 dark:bg-slate-800 flex flex-col justify-center items-center">
        <h1 className="text-xl">Billing</h1>
        <p>Manage your subscription Plan</p>
      </div>

      <div className="p-5">
        <Button onClick={handleClick}>Access Stripe</Button>
      </div>
    </div>
  );
}
