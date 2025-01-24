"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import { useEffect } from "react";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId, router]);

  if (!userId) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default InstructorLayout;
