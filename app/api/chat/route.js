import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getGeminiModel, generateContentWithRetry } from "@/lib/gemini";
import { db } from "@/lib/prisma";

const model = getGeminiModel();

export async function POST(request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to use Career Buddy." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const pageLabel =
      typeof body.pageLabel === "string" ? body.pageLabel : "Career Buddy";
    const path = typeof body.path === "string" ? body.path : "/";

    if (!message) {
      return NextResponse.json(
        { error: "Please type a message for Career Buddy." },
        { status: 400 },
      );
    }

    const profile = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: {
        name: true,
        industry: true,
        experience: true,
        bio: true,
        skills: true,
      },
    });

    const recentConversation = history
      .map(
        (item) =>
          `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`,
      )
      .join("\n");

    const prompt = `
You are Career Buddy, a cute, warm, and practical AI assistant inside a career coaching app.
Your tone should be friendly, lightly playful, and concise, but always useful.
Do not mention policy or that you are a model.
Keep the answer focused on career growth, resumes, interviews, cover letters, or industry planning.
Use short paragraphs and bullets when it improves clarity.
If the user asks for a resume, interview, or cover letter rewrite, be specific and actionable.

Current page: ${pageLabel}
Current route: ${path}
User profile: ${JSON.stringify(profile ?? {}, null, 2)}

Recent conversation:
${recentConversation || "No prior conversation."}

User message: ${message}

Return only the answer text. No markdown code fences.
`;

    const result = await generateContentWithRetry(model, prompt);
    const reply = result.response.text().trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Career Buddy is taking a quick nap. Try again in a moment." },
      { status: 500 },
    );
  }
}
