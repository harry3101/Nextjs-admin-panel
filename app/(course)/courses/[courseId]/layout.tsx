"use server"; // Ensure the file is running on the server side

import { ReactNode } from "react";
import { db } from "../../../../lib/db"; // Ensure the correct import path
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSideBar from "../../../../components/layout/CourseSideBar";
import Topbar from "../../../../components/layout/Topbar";

// ✅ Fix: Correct params type
interface LayoutProps {
  children: ReactNode;
  params: Promise<{ courseId: string }>; // Keeping params as a Promise
}

// ✅ Fix: Ensure function is async and expects correct props
export default async function CourseDetailsLayout({ children, params }: LayoutProps) {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    redirect("/sign-in");
  }

  // Await the params to resolve it
  const resolvedParams = await params;

  // Ensure courseId exists
  if (!resolvedParams.courseId) { // Accessing courseId after resolving params
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: { id: resolvedParams.courseId },
    include: {
      sections: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/");
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <aside className="w-64 bg-white border-r shadow-md overflow-y-auto">
          <CourseSideBar course={course} studentId={userId} />
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
