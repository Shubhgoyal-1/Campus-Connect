'use client'
import React from "react"
import axios from "axios"
import { toast } from 'sonner';
interface User {
  id: string
  name: string
  avatar: string
}

interface RequestPopUpProps {
  open: boolean
  title: string
  users: User[]
  onClose: () => void
}

export const RequestPopUp: React.FC<RequestPopUpProps> = ({
  open,
  title,
  users,
  onClose,
}) => {
  if (!open) return null

  const handleAction = async (username: string, action: 'accept' | 'reject' | 'cancel' | 'remove') => {
    try {
      if (action === 'accept') {
        const res = await axios.put('/api/connections', { username })
        toast.success(res.data.message)
      }
      else {
        const res = await axios.delete(`/api/connections?targetUsername=${username}&type=${action}`);
        toast.success(res.data.message)
      }
      // console.log(res.data)

    } catch (error) {
      console.error(`Failed to ${action} request:`, error)
      toast.error(`Failed to ${action} request: ${error}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[#1c1c1e] rounded-xl p-6 shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-white hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-gray-400 text-sm">No users to show.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-lg shadow-inner"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar || '/Screenshot 2024-04-21 191535.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-white">{user.name}</span>
                </div>

                {title.toLowerCase().includes("incoming") && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(user.name, 'accept')}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(user.name, 'reject')}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {title.toLowerCase().includes('outgoing') && (
                  <button
                    onClick={() => handleAction(user.name, 'cancel')}
                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Cancel
                  </button>
                )}

                {title.toLowerCase().includes('connection') && (
                  <button
                    onClick={() => handleAction(user.name, 'remove')}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
