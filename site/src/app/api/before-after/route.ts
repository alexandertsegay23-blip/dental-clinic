import { NextResponse } from 'next/server';
import { getAll } from '@/lib/storage';

export async function GET() {
  try {
    const cases = getAll<any>('before_after');
    const activeCases = cases.filter((c: any) => c.is_active !== 0).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
    return NextResponse.json({ cases: activeCases });
  } catch (error) {
    console.error('Failed to fetch before/after cases:', error);
    return NextResponse.json({ error: 'Failed to fetch before/after cases' }, { status: 500 });
  }
}
