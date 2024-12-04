import { customAlphabet } from 'nanoid';
import { getCurrentEnvironment, setPathInLocalStorage } from './storageHelper';
import { createBlogSchema, searchResultsSchema, updateBlogSchema } from './schema';
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

export function dispatchAskAppAiWithAuth(userMessage){
  const event = new CustomEvent('askAppAiWithAuth', {
      detail: userMessage
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
              }
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
      await fetch( webhook , {
        method:'POST',
        body:JSON.stringify(message)
      })
    } catch (error) {
      console.log("error sending alerts to channel ", error);
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
    return name.toLowerCase().replace(/[\s/()]+/g, '-');
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

export const improveBlogPrompt = ( writer, philosopher ) => {
  return (`Rewrite the blog to be SEO-friendly, dynamic, and in a style resembling ${writer} —engaging and decision-focused, with humorous anecdotes, quotes, dialogue or cultural references. End in a tone akin to ${philosopher}. Use rhetorical questions, conversational tone. Avoid altering the technical sections. only response with the updated JSON embedded in markdown Example:
    \n\n
    \`\`\`
    json\n {\"blog\": \This is an example blog.\"} \n 
    \`\`\`
    :- { 'blog': '<same formate as given>}
    `)
}

export  function extractJsonFromMarkdown(markdown) {
  const jsonRegex = /```json([^```]+)```/g;
  const match = jsonRegex.exec(markdown);
  if (match && match[1]) {
      const jsonData = JSON.parse(match[1].trim());
      return jsonData;
  } else {
    throw new Error("No JSON found in Markdown");
  }
}


export const restoreceDotsInArray = (key) => key.replace(/~/g, '.');

export const reFormat = (blog) => {
  blog.blog = blog.blog.map(item => {
    if (item.hasOwnProperty('what_to_cover')) {
      item.content = item.what_to_cover;
      if(Array.isArray(item.content)){
       item.content = item.content.map((review)=>{
          review.content = review.what_to_cover;
          delete review.what_to_cover;
          return review;
        })
      }
      delete item.what_to_cover; 
    }
    return item;
  });
  
  return blog;
};