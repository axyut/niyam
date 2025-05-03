import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token");
  return Response.json({ token });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return new Response("Hello, Next.js!", {
    status: 200,
    headers: { "Set-Cookie": `token=${token!.value}` },
  });
}
