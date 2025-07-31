'use client'

import Silk from '@/components/shared/Silk'
import MessagesSidebar from '@/components/chat/MessageSideBar'

export default function ChatPage() {
    return (
        <div className="relative min-h-screen flex overflow-hidden">
            {/* Full page background */}
            <div className="fixed inset-0 -z-10">
                <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
            </div>

            {/* Sidebar */}
             <MessagesSidebar />

            {/* Main area */}
            <div className="flex-1 flex items-center justify-center z-10 border border-purple-400">
                <p className="text-white text-lg">Select a user to start chatting</p>
            </div>
        </div>

    )
}
