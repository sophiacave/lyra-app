import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Fetch progress from DB by user ID
  // For now return empty progress (client-side localStorage is primary)
  return NextResponse.json({
    userId: (session.user as any).id,
    xp: 0,
    level: 1,
    completedLessons: [],
    completedCourses: [],
    streak: 0,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // TODO: Save progress to DB
  // For now acknowledge the sync request
  return NextResponse.json({
    synced: true,
    userId: (session.user as any).id,
    timestamp: new Date().toISOString(),
  });
}
