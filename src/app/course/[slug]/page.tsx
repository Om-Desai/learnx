import { prisma } from "@/server/prisma";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import { Quiz } from "@/components/quiz";
import { EventTracker } from "@/components/event-tracker";

export default async function CoursePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: { modules: { include: { quiz: { include: { questions: true } } }, orderBy: { index: "asc" } } },
  });
  if (!course) return notFound();
  return (
    <div className="space-y-6">
      <EventTracker page={`course:${course.slug}`} />
      <h1 className="text-2xl font-semibold">{course.title}</h1>
      <p className="text-gray-700">{course.description}</p>
      <div className="space-y-8">
        {course.modules.map((m) => (
          <section key={m.id} className="border rounded p-4">
            <h2 className="text-lg font-medium mb-2">{m.index + 1}. {m.title}</h2>
            {m.content && (
              <div className="prose" dangerouslySetInnerHTML={{ __html: m.content }} />
            )}
            {m.videoUrl && (
              <VideoPlayer src={m.videoUrl} title={m.title} />
            )}
            {m.quiz && (
              <Quiz quiz={m.quiz} />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

