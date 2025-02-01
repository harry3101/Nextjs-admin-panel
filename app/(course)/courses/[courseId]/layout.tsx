import CourseSideBar from "@/components/layout/CourseSideBar";
import Topbar from "@/components/layout/Topbar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Ensure this matches Next.js' LayoutProps definition
interface LayoutProps {
  children: ReactNode;
  params: { courseId: string }; // Ensure it's an object, not a Promise
}

const CourseDetailsLayout = async ({ children, params }: LayoutProps) => {
  // Ensure auth() runs correctly
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return redirect("/sign-in");
  }

  // Fetch course data with correct TypeScript handling
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      sections: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r shadow-md overflow-y-auto">
          <CourseSideBar course={course} studentId={userId} />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default CourseDetailsLayout;
