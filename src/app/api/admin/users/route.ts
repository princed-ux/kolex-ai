import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();

  // Lock it down — only you can access it
  if (session?.user?.email !== 'your@email.com') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { readFileSync, existsSync } = await import('fs');
  const { join } = await import('path');

  const dbPath = join(process.cwd(), 'data', 'users.json');
  if (!existsSync(dbPath)) return NextResponse.json([]);

  const users = JSON.parse(readFileSync(dbPath, 'utf-8'));

  // Strip passwords before returning
  return NextResponse.json(users.map(({ password, ...u }: any) => u));
}