import AIresponse from '@/components/AIresponse/AIresponse';
import Integrations from '@/components/Integrations/Integrations';
import blogServices from '@/services/blogServices';
import { fetchIntegrations, getUserById } from '@/utils/apiHelper';
import styles from './blogPage.module.scss';
import { useEffect, useState } from 'react';

export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};

  try {
    console.time("blogServices.getBlogById(blogId)");
    const blog = await blogServices.getBlogById(blogId);
    console.timeEnd("blogServices.getBlogById(blogId)");

    console.time("getUserById(blog?.createdBy)");
    const user = await getUserById(blog?.createdBy);
    console.timeEnd("getUserById(blog?.createdBy)");
    
    props.blog = blog;
    props.user = user;
  } catch (error) {
    console.error('Error fetching blog data:', error);
  }

  return { props };
}

export default function BlogPage({ blog, user }) {
  const [integrations, setIntegrations] = useState(null);

  useEffect(() => {
    const getData = async (apps) => {
      const data = await fetchIntegrations(apps);
      setIntegrations(data);
    };
    if (blog?.apps) {
      getData(blog?.apps);
    }
  }, [blog?.apps]);

  return (
    <div>
      <div className={styles.container}>
        <AIresponse blogData={blog} user={user} integrations={integrations} />
      </div>
      <Integrations integrations={integrations} />
    </div>
  );
}
