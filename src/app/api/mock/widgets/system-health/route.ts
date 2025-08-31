import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ status: "green", score: 88, sources: 12, message: "All systems nominal" });
}
