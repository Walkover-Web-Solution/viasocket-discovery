import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { Tooltip } from '@mui/material';
import { sendMessageApi } from '@/utils/apis/chatbotapis';
import { safeParse } from '@/pages/edit/[chatId]';
import Components from '@/components/ChatBotComponents/ChatBotComponents';
import BlogCard from '../Blog/Blog';
import { useRouter } from 'next/router';

const Chatbot = ({ messages, setMessages, chatId, setBlogData, bridgeId, variables, homePage, setIsOpen, isOpen, searchResults, blogId}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const divRef = useRef(null);
  const router = useRouter();

  const handleScroll = () => {
    if(divRef.current)
      divRef.current.scrollTop = divRef?.current.scrollHeight;
  };
  async function sendMessageToChatBot(inputMessage, messages, setMessages, chatId, bridgeId, variables, blogId) {
    if (inputMessage && inputMessage.trim()) {
      const userMessage = { role: 'user', content: inputMessage };
      setMessages([...messages, userMessage]);
      try {
       const data =  await sendMessageApi(userMessage.content, chatId, bridgeId, variables, blogId);
        if (data?.botResponse?.response?.data?.content) {
          const botMessage = { role: 'assistant', content: data?.botResponse?.response?.data?.content };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          if(data.created){
            router.replace('/blog/' + data.blogId);
          }
        }
      } catch (error) {
        console.error("Error communicating with the chatbot API:", error);
      }
    }
  }

  useEffect(() => {
    const handleEvent = async (e) => {
      setIsLoading(true);
      await sendMessageToChatBot(e.detail, messages, setMessages, chatId, bridgeId, variables, blogId); // Update state with event data
      setIsLoading(false);
    };  
    window.addEventListener('askAppAi', handleEvent);

    return () => {
      window.removeEventListener('askAppAi', handleEvent);
    };
  },[messages, setMessages, chatId, bridgeId, variables]);
  
  useEffect(() => {
    handleScroll();
  }, [messages, searchResults]);
  
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setInputMessage("");
      setIsLoading(true);
      handleScroll();
      try {
        await sendMessageToChatBot(inputMessage, messages, setMessages, chatId, bridgeId, variables, blogId);
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
    <div className={`${styles.chatbotContainer} ${homePage ? styles.homePage : ''} ${!isOpen ? styles.closed : ''}`}>
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
              {/* {clickable &&
                <Tooltip title="revert to this version">
                  <button
                    onClick={() => setBlogData(message.content.blog)}
                    className={styles.revertButton}
                  >
                    &#x21BA;
                  </button>
                </Tooltip>} */}
            </div>
          )
        })}
        {
          !isLoading && searchResults?.length > 0 && (
            <div className = {styles.searchResultsDiv}>
              <h3>Top Results</h3>
              <div className = {styles.searchResults}>
                {searchResults.map((blog) => {
                  blog.introduction = ' ';
                  return <BlogCard key={blog.id} blog={blog} className = {styles.blogOnSearch} />  
                })}
              </div>
            </div>
          )
        }
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
