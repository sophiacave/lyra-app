import { NextResponse } from "next/server";

export async function GET(request) {
  // Auth check via Authorization header (works without NextAuth config)
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    xp: 0,
    level: 1,
    completedLessons: [],
    completedCourses: [],
    streak: 0,
  });
}

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  return NextResponse.json({
    synced: true,
    timestamp: new Date().toISOString(),
  });
}
