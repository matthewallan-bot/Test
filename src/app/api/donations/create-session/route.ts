import { NextResponse } from "next/server";
import { createDonationSession } from "@/lib/orders";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    amountCents?: number;
    email?: string;
    message?: string;
    isAnonymous?: boolean;
    source?: string;
  } | null;

  if (typeof body?.amountCents !== "number") {
    return NextResponse.json(
      { error: "amountCents is required" },
      { status: 400 },
    );
  }

  const result = await createDonationSession({
    amountCents: body.amountCents,
    email: body.email,
    message: body.message,
    isAnonymous: body.isAnonymous,
    source: body.source,
  });

  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
