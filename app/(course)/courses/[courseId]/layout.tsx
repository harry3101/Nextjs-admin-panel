import CourseSideBar from "@/components/layout/CourseSideBar";
import Topbar from "@/components/layout/Topbar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Define the LayoutProps interface
interface LayoutProps {
  children: ReactNode;
  params: {
    courseId: string;
  };
}

const CourseDetailsLayout = async ({ children, params }: LayoutProps) => {
  const authData = await auth();
  const userId = authData?.userId;

  if (!userId) {
    redirect("/sign-in"); // No need to return here as redirect halts execution
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    redirect("/"); // No need to return here either
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <CourseSideBar course={course} studentId={userId} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default CourseDetailsLayout;