const proxyBaseURL = 'https://routes.msg91.com/api'
export const getUserById = async (id) => {
  try {
    console.log("userId:" ,id);
    const response = await fetch(`${proxyBaseURL}/${process.env.PROXY_USER_REFERENCE_ID}/getDetails?user_id=${id}`, {
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
    console.error('Error fetching user data:', error , "id" , id  );
    return null; 
  }
};

export async function updateProxyUser(userId, userDetails) {
  const updateObject = {
    user_id: userId,
    Cuser: userDetails,
  };
  try {
    const response = await fetch(`${proxyBaseURL}/${process.env.PROXY_USER_REFERENCE_ID}/updateDetails`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json', 
        Authkey: process.env.PROXY_ADMIN_TOKEN,
      },
      body:JSON.stringify(updateObject)
    }); 
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = response?.data;
    return data;
  } catch (error) {
    console.error('Error updating proxy user:', error.message);
    throw error;
  }
}