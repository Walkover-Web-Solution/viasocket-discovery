import React, { useMemo, useState } from "react";
import styles from "./UserBioPopup.module.scss";
import { Dialog } from "@mui/material";
import { useUser } from "@/context/UserContext";
import Chatbot from "../ChatBot/ChatBot";

export default function UserBioPopup({ isOpen, onClose, onSave }) {
  const {user, setUser} = useUser();
  const chatId = useMemo(() => user ? `${user.id}_${Math.random()}` : null, [user]);
  const [messages, setMessages] = useState([{
    role: 'assistant', 
    content: {
      message:'Hi! Could you start by sharing a bit about yourself, your work, and your industry? That will help us move forward.'
    }
  }]);
  async function updateUserBio(content) {
    if(content?.bio){
      setUser(prevUser => ({...prevUser, meta: {...prevUser?.meta, bio: content.bio}}));
      handleSave();
    }
  }
  function handleSave(){
    onClose();
  }

  return (
    <Dialog open = {isOpen} className = {styles.dialog}>
      <Chatbot bridgeId = {process.env.NEXT_PUBLIC_USER_BIO_BRIDGE} messages = {messages} setMessages = {setMessages} chatId = {chatId} isOpen = {true} msgCallback = {updateUserBio} inPopup/>
    </Dialog>
  );
}
