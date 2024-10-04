import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { Tooltip } from '@mui/material';
import { sendMessageApi } from '@/utils/apis/chatbotapis';
import { safeParse } from '@/pages/edit/[chatId]';
import Components from '@/components/ChatBotComponents/ChatBotComponents';

export async function sendMessageToChatBot(inputMessage, messages, setMessages, chatId, bridgeId, variables) {
  if (inputMessage.trim()) {
    const userMessage = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    try {
     const data =  await sendMessageApi(userMessage.content, chatId, bridgeId, variables)
      if (data && data?.response?.data?.content) {
        const botMessage = { role: 'assistant', content: safeParse (data?.response?.data?.content) };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Error communicating with the chatbot API:", error);
    }
  }
}

const Chatbot = ({ messages, setMessages, chatId, setBlogData, bridgeId, variables, homePage, setIsOpen, isOpen, blogData}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const divRef = useRef(null);

  const handleScroll = () => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  };

  useEffect(() => {
    const handleEvent = async(e) => {
      setIsLoading(true)
      await sendMessageToChatBot(e.detail,messages, setMessages, chatId, bridgeId, variables); // Update state with event data
      setIsLoading(false)
    };

    // Add event listener for the custom event
    window.addEventListener('askAppAi', handleEvent);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('askAppAi', handleEvent);
    };
  },[messages, setMessages, chatId, bridgeId, variables]);
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setInputMessage("");
      setIsLoading(true);
      handleScroll();
      try {
        await sendMessageToChatBot(inputMessage, messages, setMessages, chatId, bridgeId, variables);
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
  if(!isOpen) return null;

  return (
    <div className={`${styles.chatbotContainer} ${homePage ? styles.homePage : ''}`}>
      <div className = {styles.chatbotHeader}>
        <h4 className = {styles.title}>AI Assistant</h4>
        <button onClick = {() => setIsOpen(false)} className={styles.closeButton}>&#10005;</button>
      </div>
      <div className={styles.chatWindow} ref= {divRef}>
        {messages.map((message, index) => {
          const isBot = message.role === 'assistant';
          const clickable = isBot && message?.content?.blog;
          if(isBot && message?.content?.urls){
            return Components.urls(message?.content);
          }
          return (
            <div
              key={index}
              className={isBot ? styles.receivedMessage : styles.sentMessage}
              cursor={clickable ? 'pointer' : 'default'}
            >
              {isBot ? message.content.message : message.content}
              {clickable &&
                <Tooltip title="revert to this version">
                  <button
                    onClick={() => setBlogData(message.content)}
                    className={styles.revertButton}
                  >
                    &#x21BA;
                  </button>
                </Tooltip>}
              {message?.content?.urls?.length > 0 &&
                <div className={styles.urlContainer}>
                  {message?.content?.urls?.map((url, i) => (
                    <a className={styles.urlLink} key={i} href={url} target="_blank" rel="noopener noreferrer">
                      View Blog {i + 1}
                    </a>
                  ))}
                </div>}
            </div>
          )
        })}
        {isLoading && (
          <div className={styles.thinkingMessage}>
            Asking AI
            <span class={styles.loader}></span>
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
