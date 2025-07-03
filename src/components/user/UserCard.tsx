import React from 'react'
import Image from 'next/image'

const UserCard = ({ user }: { user: { username: string; skills: string[]; avatarUrl: string } }) => {
  return (
    <div className="bg-white/10 rounded-xl p-4 text-white w-56 shrink-0 flex flex-col items-center text-center space-y-3">
        <div className="w-4/5 aspect-square rounded-full overflow-hidden border-2 border-white/30">
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>
        <h4 className="text-lg font-semibold">{user.username}</h4>
        <p className="text-sm text-gray-300">Skills: {user.skills.join(', ')}</p>
        <button style={{ backgroundColor: '#3a235e' }}className="px-3 py-1 hover:bg-purple-700 rounded text-sm">
          View Profile
        </button>
      </div>
  )
}

export default UserCard