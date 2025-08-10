import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const eventSchema = z.object({
  type: z.string(),
  page: z.string().optional(),
  element: z.string().optional(),
  metadata: z.any().optional(),
  sessionId: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const { type, page, element, metadata, sessionId } = parsed.data;

  await prisma.event.create({
    data: {
      type,
      page,
      element,
      metadata: metadata as any,
      sessionId,
      userId: (session?.user as any)?.id ?? null,
      userAgent: req.headers.get("user-agent") ?? undefined,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}

