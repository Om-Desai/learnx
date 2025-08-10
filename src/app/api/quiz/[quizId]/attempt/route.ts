import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

const bodySchema = z.object({
  answersIdx: z.array(z.number()),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ quizId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId } = await context.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { index: "asc" } } },
  });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const { answersIdx } = parsed.data;

  let score = 0;
  quiz.questions.forEach((q, idx) => {
    if (answersIdx[idx] === q.answerIdx) score += 1;
  });

  await prisma.quizAttempt.create({
    data: { userId, quizId: quiz.id, answersIdx, score },
  });

  await prisma.event.create({
    data: {
      userId,
      type: "quiz_attempt",
      page: `quiz:${quiz.id}`,
      metadata: { answersIdx, score, total: quiz.questions.length },
    },
  });

  return NextResponse.json({ score, total: quiz.questions.length });
}

