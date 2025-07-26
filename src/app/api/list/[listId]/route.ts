import { NextResponse } from 'next/server';
import { getListById } from '@/lib/actions';

export async function GET(_req: Request, { params }: { params: { listId: string } }) {
  const { listId } = params;
  const result = await getListById(listId);
  if (!result.success || !result.data) {
    return NextResponse.json({ error: result.error || 'List not found' }, { status: 404 });
  }
  return NextResponse.json(result.data, { status: 200 });
} 