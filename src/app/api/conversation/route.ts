// import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ConversationModel from "@/model/Conversation.model";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { participants } = await req.json();
        console.log(participants)
        if (!participants || participants.length !== 2) {
            return Response.json({ error: "Two participants are required" }, { status: 400 });
        }

        const objectIds = participants.map((id: string) => new mongoose.Types.ObjectId(id));
        objectIds.sort((a: mongoose.Types.ObjectId, b: mongoose.Types.ObjectId) => a.toString().localeCompare(b.toString()));

        const conversationKey = objectIds.map((id: mongoose.Types.ObjectId) => id.toString()).join('_');
        console.log(conversationKey)
        const existing = await ConversationModel.findOne({
            conversationKey
        });
        console.log(existing)

        if (existing) {
            return Response.json(existing, { status: 200 });
        }

        const newConversation = await ConversationModel.create({ participants: objectIds , conversationKey });
        return Response.json(newConversation, { status: 201 });
    } catch (error) {
        console.error("Create conversation error:", error);
        return Response.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}
