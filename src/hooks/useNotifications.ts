'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import { useNotificationStore } from '@/store/notificationStore';
import { Message } from '@/store/notificationStore';

interface UseNotificationsProps {
    currentUserId: string;
}

export function useNotifications({ currentUserId }: UseNotificationsProps) {
    const pathname = usePathname();
    const addNotification = useNotificationStore((state) => state.addNotification);
    const clearConversation = useNotificationStore((state) => state.clearConversation);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentUserId) return;

        const handleNewMessage = (message: Message) => {
            const activeConversationId = pathname?.startsWith('/chat/')
                ? pathname.split('/chat/')[1]
                : null;

            const isOwnMessage = message.senderId === currentUserId;
            const isForMe = message.receiverId === currentUserId;

            if (!isForMe || isOwnMessage) return; // Ignore messages not for this user or sent by self

            // If user is not viewing this conversation, show notification
            if (message.conversationId !== activeConversationId) {
                addNotification(message);
            } else {
                // Clear existing notifications for this conversation
                clearConversation(message.conversationId);
            }
        };

        socket.on('receive-message', handleNewMessage);

        return () => {
            socket.off('receive-message', handleNewMessage);
        };
    }, [pathname, currentUserId, addNotification, clearConversation]);
}
