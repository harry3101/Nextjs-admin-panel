"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect } from "react";

const CoursesPage = () => {
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId, router]);

  if (!userId) {
    return <div>Loading...</div>; // Optional loading state while redirecting
  }

  return (
    <div>
      <Link href="/instructor/create-courses">
        <button className="btn">Create new courses</button>
      </Link>
    </div>
  );
};

export default CoursesPage;

