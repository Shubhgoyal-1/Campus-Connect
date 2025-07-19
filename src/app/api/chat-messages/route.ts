import MessageModel from "@/model/Message.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    if (!conversationId) {
        return Response.json({
            message: "conversationId is required"
        }, { status: 400 })
    }
    try {
        await dbConnect();
        const messages = await MessageModel.find({ conversationId }).sort({ timestamp: 1 }).lean();
        return Response.json({
            message: "Messages fetched successfully",
            messages
        }, { status: 200 });


    } catch (error) {
        console.log(error)
        return Response.json({
            message: "Error fetching messages"
        }, { status: 500 })
    }
}


export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { messageData } = body
        const { receiverId, conversationId, senderId, message } = messageData;
        console.log(body)

        if (!receiverId || !conversationId || !senderId || !message) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }
        console.log("passed the if statements")
        console.log(body)

        const newMessage = new MessageModel({
            senderId,
            receiverId,
            conversationId,
            message,
        })
        await newMessage.save();

        return Response.json(newMessage, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/messages error:", error);
        return Response.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}