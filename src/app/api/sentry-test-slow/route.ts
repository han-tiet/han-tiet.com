import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  Sentry.logger.info("API route hit: sentry-test-slow");

  // uncomment to test a backend error:
  // throw new Error('Sentry test: backend error');

  return NextResponse.json({ ok: true });
}
