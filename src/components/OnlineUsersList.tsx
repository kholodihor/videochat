'use client'

import { useSocket } from '@/context/SocketContext';
import { useUser } from '@clerk/nextjs';
import Avatar from './Avatar';

const OnlineUsersList = () => {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();

  console.log(onlineUsers)
  return (
    <div className='flex gap-4 border-b items-center w-full bg-slate-200 rounded-md px-2'>
      {onlineUsers && onlineUsers.map((onlineUser) => {
        if (onlineUser.profile?.id === user?.id) return null
        return (
          <div key={onlineUser.userId} onClick={() => handleCall(onlineUser)} className='flex h-full gap-2 items-center cursor-pointer'>
            <Avatar src={onlineUser.profile.imageUrl} />
            <div className='text-sm'> {onlineUser.profile.fullName?.split(" ")?.[0]}</div>
          </div>
        )
      })}
    </div>
  )
}

export default OnlineUsersList
