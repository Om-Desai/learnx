import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function POST() {
  const existing = await prisma.course.findFirst();
  if (existing) return NextResponse.json({ ok: true });

  const course = await prisma.course.create({
    data: {
      slug: "intro-to-web",
      title: "Intro to Web Development",
      description: "Learn the basics of the web with text, video, and a quick quiz.",
      modules: {
        create: [
          {
            index: 0,
            title: "What is the web?",
            content: "<p>The web is a network of documents and apps. You'll learn about HTML, CSS, and JS.</p>",
          },
          {
            index: 1,
            title: "Watch: HTML in 5 minutes",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
          {
            index: 2,
            title: "Quick quiz",
            quiz: {
              create: {
                questions: {
                  create: [
                    {
                      index: 0,
                      prompt: "What does HTML stand for?",
                      options: [
                        "Hyperlinks and Text Markup Language",
                        "Home Tool Markup Language",
                        "Hyper Text Markup Language",
                        "Hyper Tool Multi Language",
                      ],
                      answerIdx: 2,
                    },
                    {
                      index: 1,
                      prompt: "Which tag creates a hyperlink?",
                      options: ["<p>", "<div>", "<a>", "<span>"],
                      answerIdx: 2,
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  });

  return NextResponse.json({ ok: true, course });
}

