import {io} from '../../server.js'

 const onWebrtcSignal = async(data) => {
if(data.isCaller){
  if(data.ongoingCall.participants.callee.socketId){
    io.to(data.ongoingCall.participants.callee.socketId).emit('wbrtc:signal', data)
  }
} else{
  if(data.ongoingCall.participants.caller.socketId){
    io.to(data.ongoingCall.participants.caller.socketId).emit('wbrtc:signal', data)
  }
}
}

export default onWebrtcSignal