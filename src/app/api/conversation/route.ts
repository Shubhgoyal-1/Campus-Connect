// import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ConversationModel from "@/model/Conversation.model";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { participants } = await req.json();

    const existing = await ConversationModel.findOne({
      participants: { $all: participants, $size: 2 },
    });

    if (existing) {
      return Response.json(existing, { status: 200 });
    }

    const newConversation = await ConversationModel.create({ participants });
    return Response.json(newConversation, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return Response.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
