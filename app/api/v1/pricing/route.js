import { NextResponse } from 'next/server';
import { pricing, pricingTokens } from '@/lib/pricing';

export async function GET() {
  return NextResponse.json({ pricing, tokens: pricingTokens });
}
