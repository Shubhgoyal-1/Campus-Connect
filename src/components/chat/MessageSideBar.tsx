'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationStore } from '@/store/notificationStore';

type ConnectionUser = {
    _id: string;
    username: string;
    avatarUrl?: string;
};

interface MessagesSidebarProps {
    onConversationStart?: (conversationId: string) => void;
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({ onConversationStart }) => {
    const [connections, setConnections] = useState<ConnectionUser[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const router = useRouter();

    const notifications = useNotificationStore((state) => state.notifications);
    console.log("i am the notifications", notifications)
    const removeBySender = useNotificationStore((state) => state.clearConversation);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const userRes = await axios.get('/api/profile');
                const profile = userRes.data.profile;
                setCurrentUserId(profile._id);
                setConnections(profile.connections || []);
            } catch (error) {
                console.error('Failed to fetch connections:', error);
            }
        };

        fetchConnections();
    }, []);

    const openChat = async (connection: ConnectionUser) => {
        try {
            const res = await axios.post('/api/conversation', {
                participants: [currentUserId, connection._id],
            });

            const conversationId = res.data._id;

            // ✅ Mark messages as read
            await axios.put('/api/mark-read', {
                conversationId,
            });

            // ✅ Remove unread dot immediately
            removeBySender(conversationId);

            if (onConversationStart) {
                onConversationStart(conversationId);
            } else {
                router.push(`/chat/${conversationId}`);
            }
        } catch (err) {
            console.error('Error starting conversation:', err);
        }
    };

    return (
        <div className="w-80 bg-transparent border-r p-4 overflow-y-auto z-10">
            <h2 className="text-lg font-semibold text-white mb-4">Messages</h2>
            <ScrollArea className="h-full no-scrollbar overflow-y-auto">
                {connections.length > 0 ? (
                    connections.map((user) => {
                        const hasUnread = notifications.some(
                            (msg) => msg.senderId === user._id &&
                                msg.receiverId === currentUserId
                        );

                        return (
                            <div
                                key={user._id}
                                onClick={() => openChat(user)}
                                className="flex items-center gap-4 px-4 py-3 mb-3 rounded-xl cursor-pointer transition hover:bg-white/5 border border-purple-400"
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 relative flex-shrink-0 rounded-full border-2 border-white">
                                        <Image
                                            src={user.avatarUrl || '/Screenshot 2024-04-21 191535.png'}
                                            alt={user.username}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>

                                    {/* 🔴 Notification dot */}
                                    {hasUnread && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                    )}
                                </div>

                                <span className="text-white text-base font-medium">{user.username}</span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-300">No connections yet</p>
                )}
            </ScrollArea>
        </div>
    );
};

export default MessagesSidebar;
