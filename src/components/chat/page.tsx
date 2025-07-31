'use client';

import { useEffect, useState, useRef } from 'react';
import { getSocket, initiateSocket } from '@/lib/socket';
import axios from 'axios';
import Silk from '../shared/Silk';
import { useNotifications } from '@/hooks/useNotifications';

interface Message {
    senderId: string;
    receiverId: string;
    message: string;
    conversationId: string;
    timestamp?: string;
}

interface ChatProps {
    currentUserId: string;
    selectedUserId: string;
    conversationId: string;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, selectedUserId, conversationId }) => {
    useNotifications({ currentUserId });
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        initiateSocket();
        const socket = getSocket();

        socket.on('receive-message', (msg: Message) => {
            if (msg.conversationId === conversationId) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            socket.off('receive-message');
        };
    }, [conversationId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat-messages?conversationId=${conversationId}`);
                const data = await res.json();
                setMessages(data.messages);
                scrollToBottom();
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();
    }, [conversationId]);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const socket = getSocket();

        const messageData: Message = {
            senderId: currentUserId,
            receiverId: selectedUserId,
            message: inputText.trim(),
            conversationId,
        };

        socket.emit('send-message', messageData);
        setMessages(prev => [...prev, messageData]);

        try {
            const res = await axios.post('/api/chat-messages', { messageData });
            // const saved = res.data.message;
            setInputText('');
            scrollToBottom();
        } catch (err) {
            console.error('Failed to send:', err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="relative h-[89vh] w-full max-w-2xl mx-auto flex flex-col bg-white/20 px-4 py-2">
            {/* Background animation */}
            <div className="fixed inset-0 -z-10">
                <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 pb-4">
                {messages.map((msg, i) =>(
                    <div
                        key={i}
                        className={`p-2 rounded-lg max-w-[70%] whitespace-pre-wrap
                            ${msg.senderId === currentUserId
                                ? 'bg-purple-600 text-white self-end ml-auto'
                                : 'bg-purple-100 text-black self-start mr-auto'
                            }`}
                    >
                        {msg.message}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input box */}
            <div className="flex gap-2 pt-2 pb-5 bg-transparent sticky bottom-0 mt-auto">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border rounded-md px-4 py-2 bg-white"
                />
                <button
                    onClick={sendMessage}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
