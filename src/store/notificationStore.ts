import { create } from 'zustand';

// 1. Define what a message looks like
export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: string;
    read: boolean;
    conversationId: string;
}

// 2. Define the shape of the Zustand store
type NotificationStore = {
    notifications: Message[];                           // list of new/unread messages
    addNotification: (msg: Message) => void;            // function to add a new notification
    clearConversation: (conversationId: string) => void; // remove notifications from a specific conversation
};

// 3. Create the Zustand store
export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],

    // 4. Add a new message to the notification list
    addNotification: (msg) =>{
        console.log("notification added")
        set((state) => ({
            notifications: [...state.notifications, msg],
        }))
    },

    // 5. Clear notifications for a specific conversation
    clearConversation: (conversationId) =>
        set((state) => ({
            notifications: state.notifications.filter(
                (msg) => msg.conversationId !== conversationId
            ),
        })),
}));
