import AIresponse from '@/components/AIresponse/AIresponse';
import Integrations from '@/components/Integrations/Integrations';
import blogServices from '@/services/blogServices';
import { fetchIntegrations } from '@/utils/apiHelper';
import { getUserById } from '@/services/proxyServices';
import styles from './blogPage.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};
  try {
    const blog = await blogServices.getBlogById(blogId[0]);
    const user = await getUserById(blog?.createdBy);
    props.blog = blog;
    props.user=user;
    // try{
    //   const integrations = await getIntegrations(blog.apps);
    //   props.integrations = integrations;
    // }catch(error){
    //   console.error('Error fetching integrations:', error);
    // }
  } catch (error) {
    console.error('Error fetching blog data:', error); // Return an empty object if there's an error
  }
  return { props };
}

export default function BlogPage({ blog, user}) {
  const [integrations, setIntegrations] = useState(null);
  const router= useRouter();
  const formateTitle = (title) => {
    return title?.toLowerCase().replace(/\s+/g, '-'); 
  };
  useEffect(() => {
    if (blog) {
      router.replace(
        {
          pathname: `/blog/${blog.id}/${formateTitle(blog.title)}`,
        },
        undefined,
        { shallow: true } // Keeps the page from reloading
      );
    }
  }, [blog?.id]);

  useEffect(() => {
    const getData = async (apps) => {
        const data = await fetchIntegrations(apps)
        setIntegrations(data);
      
    }
    if (blog?.apps) {
      getData(blog?.apps)
    }
  }, [blog?.apps]);
  return (
    <div>
      <div className={styles.container}>
        <AIresponse blogData={blog} user={user} integrations = {integrations}/>
      </div>
      <Integrations integrations = {integrations} />
    </div>
  );
}
