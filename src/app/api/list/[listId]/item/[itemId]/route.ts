import { NextResponse } from 'next/server';
import { deleteItemFromList } from '@/lib/actions';

export async function DELETE(_req: Request, { params }: { params: { listId: string; itemId: string } }) {
  const { listId, itemId } = params;
  const result = await deleteItemFromList(listId, itemId);
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to delete item' }, { status: 400 });
  }
  return NextResponse.json(result.data, { status: 200 });
} 