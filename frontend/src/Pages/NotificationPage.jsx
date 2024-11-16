import React, { useEffect, useState } from "react";
import { CheckIcon, TimeIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";
import { MdOutlineDelete } from "react-icons/md";
import { useSocket } from "../context/SocketContext";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const NotificationPage = () => {
  // const [notifications, setNotifications] = useState([]);
  const {socket,onlineUsers,notifications,setNotifications} =useSocket()
  const [posts,setPosts]=useRecoilState(postsAtom)
  useEffect(() => {
    const getNotification = async () => {
      try {
        const res = await fetch("/api/notification/getNotification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("notification",data)
        if (data.error) {
          throw new Error(data.error);
        }
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error(error.message);
      }
    };
    getNotification();
  }, [setNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch("/api/notification/readNotification", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: id }),
      });
      const data = await res.json();
      console.log("read",data)
      if (data.error) {
        throw new Error(data.error);
      }
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, ...data } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async(id)=>{
    try {
      const res = await fetch(`/api/notification/deleteNotification`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({notificationId:id})

      })
      const data = await res.json()
   
      if(data.error){
        throw new Error(data.error)
      }
      toast.success(data.message)

      setNotifications((prevNo)=>prevNo.filter((prev)=>prev._id !== id))
       console.log("notificationDeleted",data)
    } catch (error) {
      console.log("error in deleteNotification",error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
   
  socket?.on("live",({notification})=>{
    console.log("liveNotification",notification)
    if(notification){
     return setNotifications((preNotifi)=>[...preNotifi,notification].reverse())
    }
   
  })
   return ()=> socket?.off("live")
  },[setNotifications,socket,setPosts])


  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen bg-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 bg-white rounded-md shadow-md border-l-4 ${
              notification.isRead ? "border-gray-400" : "border-blue-400"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-3">
                {notification.from && (
                  <>
                    <img
                      className="w-8 h-8 rounded-full"
                      src={notification.postUserimg.img}
                      alt={notification.postUsername.user}
                    />
                    <span className="font-bold text-gray-800">
                      {notification.postUsername.user}
                    </span>
                  </>
                )}
              </div>
              <div className="text-blue-500 font-medium">{notification.type}</div>
              <div className="text-blue-500 font-medium">{notification.likedText.length > 8?<p>{notification.likedText.slice(0,7)}.....</p>:notification.likedText }</div>
            </div>

            <div className="flex justify-between items-center mt-3">
              {notification.postImg && (
                <div className="w-12 h-12 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={notification.postImg}
                    alt="Post"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-500">
                <TimeIcon fontSize="small" />
                <span className="text-xs">{formatDate(notification.createdAt)}</span>
              </div>
              <button
                className={`px-2 py-1 text-xs rounded ${
                  notification.read ? "" : "bg-blue-500 text-white"
                }`}
                onClick={() => handleMarkAsRead(notification._id)}
              >
                {notification.read ? "" : "Read"}
              </button>
              {notification.read == true && (
                <MdOutlineDelete
                  className="text-red-500 cursor-pointer hover:text-red-800"
                  size={24}
                  onClick={() => handleDelete(notification._id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
