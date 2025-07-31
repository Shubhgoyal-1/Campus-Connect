import MessageModel from "@/model/Message.model";
import dbConnect from "@/lib/dbConnect";

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { conversationId } = body;
        if (!conversationId) {
            return Response.json({
                success: false,
                message: 'Missing required fields'
            }, { status: 400 });
        }

        await MessageModel.updateMany(
            {
                conversationId,
                read: false,
            },
            { $set: { read: true } }
        );

        return Response.json({
            success: true,
            message: 'Missing Marked as read successfully'
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error in PUT /api/messages/mark-read:', error);
        return Response.json({
            success: false,
            message: 'Failed to mark messages as read'
        }, {
            status: 500
        });
    }
}