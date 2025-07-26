import { NextResponse } from 'next/server';
import { addItemToList } from '@/lib/actions';

export async function POST(req: Request, { params }: { params: { listId: string } }) {
  const { listId } = params;
  const body = await req.json();
  const result = await addItemToList(listId, body);
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to add item' }, { status: 400 });
  }
  return NextResponse.json(result.data, { status: 200 });
} 