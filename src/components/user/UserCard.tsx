'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
import axios from 'axios';


const UserCard = ({ user }: { user: { username: string; skills: string[]; avatarUrl: string } }) => {


  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const sendingConnectionRequest = async () => {
    try {
      setIsSending(true)
      // console.log(user.username)
      const res = await axios.post('/api/connections', { recieverUsername: user.username })
      // console.log(res)
      setIsSent(true)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-white/10 rounded-xl p-4 text-white w-56 shrink-0 flex flex-col items-center text-center space-y-3">
      <div className="w-4/5 aspect-square rounded-full overflow-hidden border-2 border-white/30">
        <Image
          src={user.avatarUrl || '/Screenshot 2024-04-21 191535.png'}
          alt={user.username}
          width={100}
          height={100}
          className="object-cover w-full h-full"
        />
      </div>
      <h4 className="text-lg font-semibold">{user.username}</h4>
      <div className="flex flex-wrap justify-center gap-1 text-xs text-gray-300">
        {user.skills.slice(0, 2).map((skill, i) => (
          <span key={i} className="bg-white/10 px-2 py-0.5 rounded-full">
            {skill}
          </span>
        ))}
        {user.skills.length > 2 && <span className="text-gray-400">+{user.skills.length - 3} more</span>}
      </div>
      <div className="flex gap-2 justify-space-between ">

        <Button className="px-3 py-1 bg-[#2c1a47] hover:bg-[#3a235e] rounded text-sm">
          View Profile
        </Button>

        <Button
          size="icon"
          variant="ghost"
          disabled={isSent || isSending}
          onClick={sendingConnectionRequest}
          className={`${isSent ? 'bg-green-600' : 'bg-[#2c1a47] hover:bg-[#3a235e]'
            } text-white rounded-full p-2`}
        >
          <UserPlus size={16} />
        </Button>
      </div>
    </div>
  )
}

export default UserCard