import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.css';
import { toast } from 'react-toastify';
import { fetchBlogs, publishBlog, SearchBlogs } from '@/utils/apis/blogApis';
import AskAi from '@/components/AskAi/AskAi';

export async function getServerSideProps(context) {
    let userBlogs = [];
    let otherBlogs = [];
    try {
        const cookies = parseCookies(context);
        const token = cookies[process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT];
        const data = await fetchBlogs(token);
        userBlogs = data?.data?.userBlogs;
        otherBlogs = data?.data?.otherBlogs;
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
    return {
        props: {
            userBlogs,
            otherBlogs
        }
    };
}


export default function Home({ userBlogs, otherBlogs }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
        const fetchBlogs = async () => {
            if (searchQuery) {
                const filteredResults = await SearchBlogs(searchQuery);
                setSearchResults(filteredResults);
            } else {
                setSearchResults([]);
            }
        };
        fetchBlogs();
    }, [searchQuery]);

    // Handle chat creation
    const handleAskAi = async () => {
        // try {
        //     const data = await publishBlog();
        //     window.location.href = `discovery/edit/${data.id}`
        // } catch (err) {
        //     window.location.href = `discovery/auth`
        //     toast.error(err.message);
        // }
        setIsOpen(true);
    };

    // Conditional blog rendering
    const renderBlogsSection = (blogs, title) => (
        blogs?.length > 0 && (
            <section className={styles.Homesection}>
                <h2 className={styles.homeh2}>{title}</h2>
                <div className={styles.cardsGrid}>
                    {blogs.map((blog) => (
                        <Blog key={blog._id} blog={blog} />
                    ))}
                </div>
            </section>
        )
    );

    return (

        <>
            {!isOpen && <div className={styles.postHeaderDiv}>
                <div className={styles.postHeader}>
                    <input
                        type="text"
                        className={styles.search}
                        placeholder="Search Apps..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAskAi();
                            }
                        }
                        }
                    />
                    <button className={styles.newChat} onClick={handleAskAi}>ASK AI</button>
                </div>
                <div>
                    {searchResults.length > 0 ? (
                        <div>
                            <h2 className={styles.homeh2}>Search Results</h2>
                            <div className={styles.cardsGrid}>
                                {searchResults.map((blog) => (
                                    <Blog key={blog._id} blog={blog} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {renderBlogsSection(userBlogs, 'Your categories')}
                            {renderBlogsSection(otherBlogs, 'Top Categories')}
                        </>
                    )}
                </div>
            </div>}
            {isOpen && <AskAi searchQuery={searchQuery} />}
        </>
    );
}
