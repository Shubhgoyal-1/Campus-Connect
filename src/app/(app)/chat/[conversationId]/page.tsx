// app/chat/[conversationId]/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import ConversationModel from '@/model/Conversation.model';
import Chat from '@/components/chat/page';
import MessagesSidebar from '@/components/chat/MessageSideBar'; 

interface PageProps {
    params: {
        conversationId: string;
    };
}

export default async function ChatPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="text-center mt-10 text-red-500">
                You must be logged in to view this page.
            </div>
        );
    }

    const currentUserId = session.user._id;
    const { conversationId } = await params;
    await dbConnect();

    const conversation = await ConversationModel.findById(conversationId).lean();

    if (!conversation) {
        return (
            <div className="text-center mt-10 text-gray-600">
                Conversation not found.
            </div>
        );
    }

    const participants = conversation.participants.map((id) => id.toString());
    const selectedUserId = participants.find((id) => id !== currentUserId);

    if (!selectedUserId) {
        return (
            <div className="text-center mt-10 text-gray-600">
                Other participant not found.
            </div>
        );
    }

    return (
        <div className="flex h-[90vh] overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-purple-500 bg-[#1a1a2e] z-10">
                <MessagesSidebar />
            </div>

            {/* Main chat area */}
            <div className="flex-1 bg-transparent border-purple-500 border-4 ">
                <Chat
                    currentUserId={currentUserId}
                    selectedUserId={selectedUserId}
                    conversationId={conversationId}
                />
            </div>
        </div>
    );
}
