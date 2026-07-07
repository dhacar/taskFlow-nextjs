import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mask(value: string | undefined) {
  if (!value) {
    return null;
  }

  if (value.length <= 16) {
    return `${value.slice(0, 3)}...${value.slice(-3)}`;
  }

  return `${value.slice(0, 12)}...${value.slice(-12)}`;
}

async function hash(value: string | undefined) {
  if (!value) {
    return null;
  }

  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export async function GET() {
  const authGoogleId = process.env.AUTH_GOOGLE_ID;
  const legacyGoogleId = process.env.GOOGLE_CLIENT_ID;
  let database:
    | {
        ok: true;
      }
    | {
        ok: false;
        errorName: string;
        errorMessage: string;
      };

  try {
    await connectToDatabase();
    database = { ok: true };
  } catch (error) {
    database = {
      ok: false,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : "Unknown database connection error."
    };
  }

  return NextResponse.json(
    {
      authGoogleId: {
        present: Boolean(authGoogleId),
        masked: mask(authGoogleId),
        sha256Prefix: await hash(authGoogleId)
      },
      legacyGoogleClientId: {
        present: Boolean(legacyGoogleId),
        masked: mask(legacyGoogleId),
        sha256Prefix: await hash(legacyGoogleId)
      },
      urls: {
        authUrl: process.env.AUTH_URL ?? null,
        nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
        vercelUrl: process.env.VERCEL_URL ?? null
      },
      database,
      expectedCallbackPath: "/api/auth/callback/google"
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
