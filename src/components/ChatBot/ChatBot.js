import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { Tooltip } from '@mui/material';
import { sendMessageApi } from '@/utils/apis/chatbotapis';
import Components from '@/components/ChatBotComponents/ChatBotComponents';
import BlogCard from '../Blog/Blog';
import { useRouter } from 'next/router';

const Chatbot = ({ messages, setMessages, chatId, bridgeId, variables, homePage, setIsOpen, isOpen, searchResults, blogId, inPopup, msgCallback }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const divRef = useRef(null);
  const router = useRouter();
  const inputRef = useRef(null);

  const handleScroll = () => {
    if(divRef.current)
      divRef.current.scrollTop = divRef?.current.scrollHeight;
  };
  async function sendMessageToChatBot(message = inputMessage) {
    if (message && message.trim()) {
      const userMessage = { role: 'user', content: message };
      setMessages([...messages, userMessage]);
      try {
        const data =  await sendMessageApi(userMessage.content, chatId, bridgeId, variables, blogId);
        const content = data?.botResponse?.response?.data?.content;
        if (content) {
          const botMessage = { role: 'assistant', content };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          if(data.created){
            router.replace('/blog/' + data.blogId);
          }
          msgCallback?.(content);
        }
      } catch (error) {
        console.error("Error communicating with the chatbot API:", error);
      }
    }
  }

  useEffect(() => {
    const handleEvent = async (e) => {
      setIsLoading(true);
      await sendMessageToChatBot(e.detail); // Update state with event data
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
        await sendMessageToChatBot(inputMessage);
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

  useEffect(() => {
    inputRef.current?.focus();  
  }, [])

  if(!isOpen) return null;

  return (
    <div className={`${styles.chatbotContainer} ${homePage ? styles.homePage : ''} ${!isOpen ? styles.closed : ''} ${inPopup ? styles.inPopup : ''}`}>
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
          ref = {inputRef}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Ask AI
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
