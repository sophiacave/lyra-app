import { NextResponse } from "next/server";
import { getSessionFromRequest } from "../../../lib/auth.js";
import { getProgress, completeLesson } from "../../../lib/supabase.js";

export const runtime = 'nodejs';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await getProgress(session.email);

  return NextResponse.json({
    xp: progress.totalXp,
    level: progress.level,
    completedLessons: progress.completedLessons,
    streak: progress.streak,
  });
}

export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { courseSlug, lessonSlug, xp } = body;

  if (!courseSlug || !lessonSlug) {
    return NextResponse.json({ error: "Missing courseSlug or lessonSlug" }, { status: 400 });
  }

  const result = await completeLesson({
    email: session.email,
    courseSlug,
    lessonSlug,
    xp: xp || 10,
  });

  if (!result) {
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }

  return NextResponse.json({
    synced: true,
    lesson: result,
    timestamp: new Date().toISOString(),
  });
}
