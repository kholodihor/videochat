'use client'

import { useSocket } from '@/context/SocketContext';
import React from 'react'
import Avatar from './Avatar';
import { Button } from './ui/button';
import { MdCall, MdCallEnd } from 'react-icons/md';

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, rejectCall } = useSocket();

  if (!ongoingCall?.isRinging) return;

  return (
    <div className='absolute bg-black  backdrop-blur-sm bg-opacity-80 w-screen h-screen inset-0 flex items-center justify-center'>
      <div className='bg-white min-w-[400px] min-h-[150px] flex flex-col items-center justify-center rounded p-4'>
        <div className='flex gap-2 items-center flex-col'>
          <Avatar src={ongoingCall.participants.caller.profile.imageUrl} />
          <h3 className='text-sm'>{ongoingCall.participants.caller.profile.firstName || ongoingCall.participants.caller.profile.fullName}</h3>
          <p>Incoming Call</p>
        </div>
        <div className='flex gap-2 mt-4'>
          <Button onClick={() => handleJoinCall(ongoingCall)} className='w-20 h-10 bg-green-500 hover:bg-green-600 flex justify-center items-center text-white'>
            <MdCall size={24} />
          </Button>
          <Button onClick={rejectCall} className='w-20 h-10 bg-rose-500 hover:bg-rose-600 flex justify-center items-center text-white'>
            <MdCallEnd size={24} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CallNotification
