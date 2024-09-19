import { useState } from 'react';
import styles from './Chatbot.module.css';
import { Tooltip } from '@mui/material';
import { sendMessageApi } from '@/utils/apis/chatbotapis';
import { safeParse } from '@/pages/edit/[chatId]';
const Chatbot = ({ messages, setMessages, chatId, setBlogData }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = { role: 'user', content: inputMessage };
      setMessages([...messages, userMessage]);
      setInputMessage("");
      setIsLoading(true);
      try {

       const data =  await sendMessageApi(userMessage.content, chatId)
       
        if (data && data?.response?.data?.content) {
          const botMessage = { role: 'assistant', content: safeParse (data?.response?.data?.content) };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } catch (error) {
        console.error("Error communicating with the chatbot API:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatWindow}>
        {messages.map((message, index) => {
          const isBot = message.role === 'assistant';
          const clickable = isBot && message?.content?.blog;
          return (
            <div
              key={index}
              className={isBot ? styles.receivedMessage : styles.sentMessage }
              cursor = {clickable ? 'pointer' : 'default'}
            >
              {isBot ? message.content.message : message.content}
              {clickable && 
              <Tooltip title="revert to this version">
                <button
                  onClick = {() => setBlogData(message.content)}
                  className={styles.revertButton}
                >
                  &#x21BA;
                </button>
              </Tooltip>}
            </div>
          )
        })}
        {isLoading && (
          <div className={styles.thinkingMessage}>
            Generating results...
          </div>
        )}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Ask AI
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
