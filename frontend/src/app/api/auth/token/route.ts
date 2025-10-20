import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await getAccessToken(); 
    return NextResponse.json({ accessToken: token?.accessToken });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
