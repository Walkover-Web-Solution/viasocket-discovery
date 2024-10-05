import { useUser } from "@/context/UserContext";
import AIresponse from "../AIresponse/AIresponse";
import ChatBot from "../ChatBotAIMiddleWare/ChatBot";
import styles from "@/components/AskAi/AskAi.module.css"
import { useState } from "react";
export default function AskAi(searchQuery) {
    const {isChatOpen}=useUser();
  const [blogData, setBlogData] = useState('');
    
    return (
        <div className={styles.AskAiDiv}>
            <div
                id="chatbot-container"
                style={isChatOpen ? { width: '30%', height: '96%' } : {display:'none'}}
            />
            <ChatBot isOpen={true} searchQuery={searchQuery} setBlogData={setBlogData}/>
            <AIresponse blogData={blogData} isEditable={true} chatId={blogData?.id}/>
        </div>
    )
}
