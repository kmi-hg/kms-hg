import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  const { roomId } = await context.params;
  const { question } = await req.json();

  if (!question) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  try {
    // Call FastAPI backend to get AI response
    const aiResponse = await fetch("http://127.0.0.1:8000/ask_question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    // If FastAPI responds with something other than JSON, handle it here
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI service error: ${errorText}`);
    }

    // Try to parse the response as JSON
    let aiData = await aiResponse.json();

    // If it's not JSON, assume the response is plain text
    if (!aiData.answer) {
      const aiText = await aiResponse.text();
      aiData = { answer: aiText };  // Fallback to plain text
    }

    const aiText = aiData.answer;
    console.log(aiText);

    // Return AI response
    return NextResponse.json({ answer: aiText });
  } catch (error) {
    console.error("Error calling AI service:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
