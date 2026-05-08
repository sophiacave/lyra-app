import { NextResponse } from 'next/server';
import { getCourseBySlug } from '@/lib/courses';

export async function GET(_request, { params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  return NextResponse.json(course);
}
