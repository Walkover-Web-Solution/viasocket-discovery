import { useUser } from '@/context/UserContext';
import { getBlogById } from '@/utils/apis/blogApis';
import { useEffect, useState } from 'react';

export default function ChatBot({ parentId, chatId, isOpen, searchQuery, setBlogData, blog, bridgeId }) {
    const { setIsChatOpen } = useUser()
    delete blog?.createdAt;
    delete blog?.createdBy;
    delete blog?.apps;
    console.log('blog here ', blog);
    useEffect(() => {
        const handleMessage = (event) => {
            const receivedData = event.data;
            if (receivedData.type =='ChatbotResponse' && receivedData.message?.udpate ) {
                
            }
            // if 
            console.log('Data received from chatbot:', receivedData);
            if (receivedData.type === 'open') {
                setIsChatOpen(true);
            }
            if (receivedData.type === 'close') {
                setIsChatOpen(false);
            }
            if (receivedData?.message?.update) {
                console.log('isme ghusaaaa kyaaaa !!!!')
                const fetchBlog = async () => {
                    const newBlog = await getBlogById(blog?.id );
                    if (newBlog?.blog) {
                        setBlogData(newBlog);
                    } else {
                        console.error("no blog AI ", blog)
                    }
                }
                fetchBlog();
            }

        };
        const intervalId = setInterval(() => {
            if (typeof window.SendDataToChatbot === 'function' ) {
                window.SendDataToChatbot({
                    bridgeName: bridgeId || "udpate_blog" || process.env.NEXT_PUBLIC_BRIDGE_SLUGNAME,
                    threadId: `harsh`,
                    variables : {
                        blog_id :  blog?.id,
                        current_blog : JSON.stringify(blog), 
                    },
                    // parentId: "chatbot-container",
                    // fullScreen: true,//true when using a perfect container 
                    hideCloseButton: false,
                    hideIcon: false,
                    askAi: searchQuery
                });
                if (isOpen) {
                    window.openChatbot();
                    setIsChatOpen(true);
                }
                clearInterval(intervalId)
            }
        }, 100);


        window.addEventListener('message', handleMessage);
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('message', handleMessage);
        };

    }, []);

    return (
        <>
        </>
    );
}
