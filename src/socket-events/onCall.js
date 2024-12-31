import { io } from '../../server.js'

const onCall = async(participants) => {
  if(participants.callee.socketId){
    io.to(participants.callee.socketId).emit('call-user', { participants, isRinging: true })
  }
}

export default onCall