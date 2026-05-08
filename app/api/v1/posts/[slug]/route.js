import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';

export async function GET(_request, { params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}
