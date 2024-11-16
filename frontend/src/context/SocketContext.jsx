import{ createContext, useContext, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import io from "socket.io-client"
import userAtom from "../atoms/userAtom"



const SocketContext = createContext()



export const useSocket = ()=>{
    return useContext(SocketContext)
}
export const SocketContextProvider = ({children}) =>{
    const user = useRecoilValue(userAtom)
  const [socket,setSocket]=useState(null)
  const [onlineUsers,setOnlineUsers]=useState([])
  const [notifications,setNotifications] = useState([])
  const [notificationLength,setNotificationLength] = useState()
  const [typing,setTyping] = useState()
  const [selectedUserId,setSelectedUserId] = useState()
  //https://threads-socket.onrender.com
  //"http://localhost:4900"
  useEffect(()=>{
    const socket = io("http://localhost:4900",{
        query:{
            userId:user?._id
        }
    })

    setSocket(socket)

    socket.on("getOnlineUsers",(users)=>{
          setOnlineUsers(users)
    })
 
    return () => socket.close()  
                
  },[user?._id])

  console.log("onlineUsers:",onlineUsers)

    return (<SocketContext.Provider  value={{socket,notificationLength,setNotificationLength,selectedUserId,setSelectedUserId,setSocket,onlineUsers,notifications,setNotifications,typing,setTyping}} >
{children}
    </SocketContext.Provider>)
}