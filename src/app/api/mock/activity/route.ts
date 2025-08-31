import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  return NextResponse.json({ page, items: [ { id: 1, text: "User logged in", ts: Date.now() } ] });
}
