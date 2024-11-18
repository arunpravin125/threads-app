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
  const [toUser,setToUser] = useState()
  const [selectedUserId,setSelectedUserId] = useState()
  //https://threads-socket.onrender.com,https://threads-app-3-sr8q.onrender.com
  //"http://localhost:4900"
  useEffect(()=>{

    if(user){
        const socket = io("http://localhost:4900",{
            query:{
                userId:user?._id
            }
        })
    
        setSocket(socket)
    
        socket.on("getOnlineUsers",(users)=>{
              setOnlineUsers(users)
        })
     
       
    }else{
        
            socket?.close()
            setSocket(null)
        
    }
     
                
  },[user?._id])

  console.log("onlineUsers:",onlineUsers)

    return (<SocketContext.Provider  value={{socket,toUser,setToUser,notificationLength,setNotificationLength,selectedUserId,setSelectedUserId,setSocket,onlineUsers,notifications,setNotifications,typing,setTyping}} >
{children}
    </SocketContext.Provider>)
}