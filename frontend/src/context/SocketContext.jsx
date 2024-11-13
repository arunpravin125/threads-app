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
  //https://threads-socket.onrender.com
  //"http://localhost:4900"
  useEffect(()=>{
    const socket = io("https://threads-app-2-q8fs.onrender.com",{
        query:{
            userId:user?._id
        }
    })

    setSocket(socket)

    socket.on("getOnlineUsers",(users)=>{
          setOnlineUsers(users)
    })
 
    return () => socket && socket.close()  
                
  },[user?._id])

  console.log("onlineUsers:",onlineUsers)

    return (<SocketContext.Provider  value={{socket,setSocket,onlineUsers}} >
{children}
    </SocketContext.Provider>)
}