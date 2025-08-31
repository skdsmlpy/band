import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ score: 93, policies: 18 });
}
