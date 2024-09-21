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
    const time = {};
    time["blogServices.getBlogById(blogId)"] = Date.now();
    const blog = await blogServices.getBlogById(blogId);
    time["blogServices.getBlogById(blogId)"] -= Date.now();

    time["getUserById(blog?.createdBy)"] = Date.now();
    const user = await getUserById(blog?.createdBy);
    time["getUserById(blog?.createdBy)"] -= Date.now();
    
    props.time = time;
    props.blog = blog;
    props.user = user;
  } catch (error) {
    console.error('Error fetching blog data:', error);
  }

  return { props };
}

export default function BlogPage({ blog, user, time }) {
  const [integrations, setIntegrations] = useState(null);
  console.log('time taken', time);
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
