export const getUserById = async (id) => {
    try {
      const response = await fetch(`https://routes.msg91.com/api/${process.env.PROXY_USER_REFERENCE_ID}/getDetails?user_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authkey': process.env.PROXY_ADMIN_TOKEN,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const userData = data?.data?.data?.[0];
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null; 
    }
  };