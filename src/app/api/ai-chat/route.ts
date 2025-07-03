// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateRecipeSuggestions } from '../../../lib/ai/gemini'

export async function POST(req: NextRequest) {
  const { ingredients, prompt } = await req.json()
  const answer = await generateRecipeSuggestions(ingredients, prompt)
  return NextResponse.json({ answer })
}