// app/api/bale/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUpdates } from "@/features/bale/baleService";

export async function GET() {
  try {
    const updates = await getUpdates(15); // آخرین ۱۵ آپدیت

    return NextResponse.json({
      success: true,
      count: updates.length,
      updates,
    });
  } catch (error: any) {
    console.error("Bale Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}