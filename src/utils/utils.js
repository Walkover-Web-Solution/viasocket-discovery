import { customAlphabet } from 'nanoid';
import { getCurrentEnvironment, setPathInLocalStorage } from './storageHelper';
import { createBlogSchema, searchResultsSchema, updateBlogSchema } from './schema';
import { getUserById } from '@/services/proxyServices';
const axios = require('axios');
export const dummyMarkdown = `# Welcome to App Discovery: Unleash the Power of AI-Driven Software Discovery!

## Discover Tailored Solutions Just for You

In the ever-evolving world of technology, finding the perfect app or software that fits your unique needs can be a daunting task. That's where we come in! At **App Discovery**, our cutting-edge AI is here to revolutionize the way you search for and discover software. 

### How It Works:

1. **Describe Your Needs**: Tell our intelligent AI exactly what you're looking for. Whether it's a tool to streamline your workflow, a game to entertain you, or an app to boost your productivity, just provide a brief description of your needs.

2. **Receive Tailored Suggestions**: Our AI will sift through the latest and greatest software options to find the perfect match for you. No more endless searching—just precise, tailored recommendations that hit the mark.

3. **Share Your Discoveries**: Found something fantastic? Don’t keep it to yourself! Publish your discoveries and let others benefit from your insights. Share the love and help others find their perfect software too!

### Why App Discovery?

- **AI-Powered Precision**: Our AI doesn't just throw random suggestions your way. It understands your needs and provides recommendations that are spot-on.
- **Stay Updated**: Always find the latest software that meets your criteria. We're constantly updating our database to include the newest and most relevant apps.
- **Community-Driven**: Your contributions help build a better resource for everyone. The more you share, the more valuable our platform becomes for the entire community.

So dive in, explore, and let AI guide you to the best software out there. Discover, share, and elevate your tech experience today!

Happy discovering!
`;

export const generateNanoid = (length = 6) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const nanoid = customAlphabet(alphabet, length);
    return nanoid();
};

export function dispatchAskAiEvent(userMessage) {
    const event = new CustomEvent('askAppAi', {
        detail: userMessage
    });
    window.dispatchEvent(event); // Emit the event globally
};

export function dispatchAskAppAiWithAuth(userMessage, callbackFunc){
  const event = new CustomEvent('askAppAiWithAuth', {
      detail: {
        message: userMessage, 
        callback: callbackFunc
      }
  });
  window.dispatchEvent(event);
}

export async function askAi(bridgeId, userMessage, variables, chatId) {
  const PAUTH_KEY = process.env.PAUTH_KEY;

  try {
      const response = await axios.post(
          'https://routes.msg91.com/api/proxy/1258584/29gjrmh24/api/v2/model/chat/completion',
          {
              user: userMessage,
              bridge_id: bridgeId,
              thread_id: chatId ? chatId + "" : undefined,
              variables: variables
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'pauthkey': PAUTH_KEY,
              },
              timeout: 1000 * 60 * 3,
          }
      );

      return await response.data;
  } catch (error) {
      console.error('Error in askAi:', error);
      throw error;
  }
}

export const sendMessageTochannel = async (message) => {
    try {
      const webhook =  getCurrentEnvironment() === 'prod' ? "https://flow.sokt.io/func/scri19UK6620" : "https://flow.sokt.io/func/scriTdhvDTJK" ;
      const res = await fetch( webhook , {
        method:'POST',
        body:JSON.stringify(message)
      })
      if(!res.ok) throw new Error(res.text());
    } catch (error) {
      console.error("error sending alerts to channel ", error);
    }
}

export const handleSignIn = async () => {
    setPathInLocalStorage()
    window.location.href = getCurrentEnvironment()==='local'?'/discovery/auth' : "https://viasocket.com/login?redirect_to=/discovery/auth";
};

export const  ValidateAiResponse = (response ,schema) => {
    const { error, value: validatedResponse } = schema.validate(response, { abortEarly : false } );
    if (error) {
      const errorMessages = error.details.map(err => err.message).join(', ');
      return { success: false , errorMessages : errorMessages };
    }
    return { success : true , value : validatedResponse };
  }

export function sendAlert(message,  bridgeId, message_id, thread_id ){
  sendMessageTochannel({
    message: ` ${message}`,
    bridgeId:bridgeId,
    message_id:message_id,
    link : ` https://ai.walkover.in/org/7488/bridges/history/${bridgeId}?thread_id=${thread_id} `,
    thread_id:thread_id,
});
}
export function nameToSlugName(name){
    return name.toLowerCase()                   // Convert text to lowercase
    .trim()                          // Remove whitespace from both sides
    .replace(/[^\w\s-]/g, '')        // Remove special characters
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-');            // Replace multiple hyphens with a single hyphen
}

export function appNameToId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
}


export function safeParse(json,bridgeId,threadId){
  try {
    let data = JSON.parse(json);
    if(bridgeId === process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE){
      data =  ValidateAiResponse(data,updateBlogSchema,bridgeId,threadId,false);
      if(data.success === true){
        data = data.value;
      } else {
          data = { message: "something went wrong" }
      }
    }else if(bridgeId == process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE){
      if(data.blog) {
        data = ValidateAiResponse(data , createBlogSchema, bridgeId, threadId,false);
        if(data.success === true){
        data= data.value; 
        } else {
          data = {message:"something went wrong "}
        }
      }
      else {
        data = ValidateAiResponse(data, searchResultsSchema, bridgeId, threadId,false);
        if(data.success === true){
          data= data.value;
        } else {
          data = {message:"something went wrong "}
        }
      }
    }
    return data;
  }
  catch (e){
    console.log(e)
    return { message : json };
  }
}

export const replaceDotsInKeys = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = key.replace(/\./g, '~');
    acc[newKey] = obj[key];
    return acc;
  }, {});
};

export const restoreDotsInKeys = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const originalKey = key.replace(/~/g, '.');
    acc[originalKey] = obj[key];
    return acc;
  }, {});
};

export const replaceDotsInArray = (key) => key.replace(/\./g, '~');

export const improveBlogPrompt = ( writer ) => {
  return (`
    Purpose: Review and rewrite the blog to ensure it solves its purpose.
    Instructions:
    SEO-friendly.
    Use simple, relatable English with only 1% infusion of the writer’s ${writer} distinctive tone to make the blog unique yet seamlessly engaging.
    Maintain a decision-focused style that guides the reader effectively.
    Include one cultural reference and rhetorical questions to connect with the local audience.
    Tone Preference:
    The content should remain simple and relatable but carry a very little slight touch of the writer’s unique style to make it stand out without overwhelming the reader.
    only response with the updated JSON embedded in markdown Example:
    \n\n
    \`\`\`
    json\n {\"blog\": \This is an example blog.\"} \n 
    \`\`\`
    :- { 'blog': '<same formate as given>}
    `)
}

export  function extractJsonFromMarkdown(markdown) {
  try {
    const jsonRegex = /```json([^```]+)```/g;
    const match = jsonRegex.exec(markdown);
    // if (match && match[1]) {
        const jsonData = JSON.parse(match[1].trim());
        return jsonData;
    // } else {
    //   throw new Error("No JSON found in Markdown");
    // }
  } catch (error) {
    throw new Error("Not able to extract JSON from Markdown !");
    
  }
}


export const restoreceDotsInArray = (key) => key.replace(/~/g, '.');

export const reFormat = (blog) => {
  blog.blog = blog.blog.map(item => {
    if (item.hasOwnProperty('what_to_cover')) {
      item.content = item.what_to_cover;
      delete item.what_to_cover; 
    }
    return item;
  });
  
  return blog;
};

export function  getAppNames(sections){
  let appNames = [];
  for (let i = 0; i < sections.length; i++) {
    if (sections[i]?.section === 'detailed_reviews') {
      appNames = sections[i].content.map(app => app.appName);
      break;
    }
  }
  return appNames;
}


export async function getAllUsers(userIds){
  return await Promise.all(
    userIds.map( (userId) => {
     return  getUserById(userId);
    }));
}
export function formatDate(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); 

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (minutes < 60) return "Today";
  if (days < 7) return `${days} Day${days>1?'s':''} ago`;
  if (weeks < 4) return `${weeks} Week${weeks>1?'s':''} ago`;

  const options = { month: "long", day: "numeric", year: "numeric" };
  return `on ${date.toLocaleDateString("en-US", options)}`;
}

export async function updateRecord(id,updatedBlog,env) {
    if(env != 'prod') return ;
    try {
      const response = await axios.patch(
        'https://table-api.viasocket.com/67936e431fbdc1e11a5c9cc4/tblprvr4a',
        {
          records: [
            {
              where: `id = '${id}'`,
              fields: updatedBlog,
            }
          ]
        },
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'auth-key': process.env.AUTH_KEY_BLOG_DATA
          }
        }
      );
    } catch (error) {
        sendMessageTochannel({message:`Error while updating blog row in db dash :, ${ error.response ? error.response.data : error.message}`})
        console.error('Error while updating blog row in db dash:',  error.response ? error.response.data : error.message);
    }
}



export function formatBlogDataForDbDash(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const keyMap = {
    blog: 'blog',
    title: 'title',
    titleDescription: 'titledescription',
    tags: 'tags',
    apps: 'apps',
    meta: 'meta',
    countryCode: 'countrycode',
    createdBy: 'created_by',
    slugName: 'slugname',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    appNames: 'appnames',
    comments: 'comments',
    toUpdate: 'toupdate',
    lastImproved: 'lastimproved',
    toImprove: 'toimprove'
  };
  return Object.keys(obj).reduce((formatted, key) => {
    const formattedKey = keyMap[key] || key; 
    formatted[formattedKey] = obj[key];
    return formatted;
  }, {});
}
export async function SendNewBlogTODbDash(newBlog,env) {
  if(env != "prod") return ;
  try {
    await axios.post("https://flow.sokt.io/func/scril46vLH1K", newBlog, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    sendMessageTochannel(`Error creating blog in db dash : ${err.message}`);
    console.error("Error creating blog in db dash :", err);
  }
}