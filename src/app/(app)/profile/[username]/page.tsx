'use client'
import Silk from '@/components/shared/Silk'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { UserPlus, ArrowDownUp, Users } from 'lucide-react'
import { RequestPopUp } from '@/components/user/RequestPopUp'
import axios from 'axios'

type MinimalUser = {
    _id: string
    username: string
    avatarUrl?: string
}

type UserType = {
    username: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    canTeach?: boolean;
    connections: MinimalUser[];
    incomingRequests: MinimalUser[];
    outgoingRequests: MinimalUser[];
};

const Page = () => {
    const params = useParams<{ username: string }>();
    const [user, setUser] = useState<UserType | null>(null);
    const [openConnections, setOpenConnections] = useState(false);
    const [openIncoming, setOpenIncoming] = useState(false);
    const [openOutgoing, setOpenOutgoing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/profile');
                setUser(res.data.profile)
            } catch (error) {
                console.log(error)
            }
        }
        fetchProfile()
    }, [])
    if (!user) return <p className="text-red-500">User not found</p>

    return (
        <div>
            <div className="fixed inset-0 -z-10">
                <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
            </div>
            <div className="flex flex-col min-h-screen text-white p-6">
                {/* Top Section */}
                <div className="flex flex-row justify-between">
                    {/* Left Side Buttons */}
                    <div className="flex flex-row gap-6 mt-10">
                        <Button variant="ghost" className="bg-white/10 w-32 flex items-center gap-2" onClick={() => setOpenConnections(true)}>
                            <Users size={18} /> Connections ({user?.connections.length || 0})
                        </Button>
                        <Button variant="ghost" className="bg-white/10 w-32 flex items-center gap-2" onClick={() => setOpenIncoming(true)}>
                            <ArrowDownUp size={18} /> Incoming({user?.incomingRequests.length || 0})
                        </Button>
                        <Button variant="ghost" className="bg-white/10 w-32 flex items-center gap-2" onClick={() => setOpenOutgoing(true)}>
                            <UserPlus size={18} /> Outgoing({user?.outgoingRequests.length || 0})
                        </Button>
                    </div>

                    {/* Right Side Profile */}
                    <div className="flex flex-col items-center bg-white/10 rounded-xl p-6 w-64">
                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white">
                            <Image src={user.avatarUrl || "/Screenshot 2024-04-21 191535.png"} alt="profile" width={144} height={144} className="object-cover w-full h-full" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">{params!.username}</h3>
                        <Button onClick={() => router.push(`/profile/${params!.username}/edit`)} className="bg-blue-400 text-black hover:bg-blue-500 mt-4">
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Bottom Section: Bio */}
                <Card className="bg-white/10 p-6 mt-10 rounded-xl text-white">
                    <h4 className="text-lg font-semibold mb-2">About Me</h4>
                    <p className="text-sm text-gray-300">
                        {user.bio || "This is the user bio. It can be fetched from DB and rendered here."}
                    </p>
                </Card>

                {/* Popup if any */}
                <RequestPopUp
                    open={openConnections}
                    onClose={() => setOpenConnections(false)}
                    users={user.connections.map((u) => ({
                        id: u._id,
                        name: u.username,
                        avatar: u.avatarUrl || '/Screenshot 2024-04-21 191535.png',
                    }))}
                    title="Connections"
                />
                <RequestPopUp
                    open={openIncoming}
                    onClose={() => setOpenIncoming(false)}
                    users={user.incomingRequests.map((u) => ({
                        id: u._id,
                        name: u.username,
                        avatar: u.avatarUrl || '/Screenshot 2024-04-21 191535.png',
                    }))}
                    title="Incoming Requests"
                />
                <RequestPopUp
                    open={openOutgoing}
                    onClose={() => setOpenOutgoing(false)}
                    users={user.outgoingRequests.map((u) => ({
                        id: u._id,
                        name: u.username,
                        avatar: u.avatarUrl || '/Screenshot 2024-04-21 191535.png',
                    }))}
                    title="Outgoing Requests"
                />
            </div>
        </div>
    )
}

export default Page