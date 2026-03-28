import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request) {
  // Verify cron secret to prevent unauthorized revalidation
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
