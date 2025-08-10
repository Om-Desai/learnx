import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { prisma } from "@/server/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const courses = await prisma.course.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}</h1>
      <p className="text-sm text-gray-600">Pick a course to start learning.</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <li key={c.id} className="border rounded p-4">
            <h3 className="font-medium">{c.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{c.description}</p>
            <Link className="text-blue-600" href={`/course/${c.slug}`}>Open</Link>
          </li>
        ))}
      </ul>
      {!courses.length && (
        <p className="text-sm">No courses yet. An example course will be seeded on first run.</p>
      )}
    </div>
  );
}

