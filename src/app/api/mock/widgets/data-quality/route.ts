import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ avg: 82.4 });
}
