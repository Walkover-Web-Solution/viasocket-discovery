import { customAlphabet } from 'nanoid';
import { getCurrentEnvironment, setPathInLocalStorage } from './storageHelper';
import { createBlogSchema, searchResultsSchema, updateBlogSchema } from './schema';
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

export async function askAi(bridgeId, userMessage, variables, chatId) {
    const PAUTH_KEY = process.env.PAUTH_KEY;

    const response = await fetch(
        'https://routes.msg91.com/api/proxy/1258584/29gjrmh24/api/v2/model/chat/completion',
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'pauthkey': PAUTH_KEY,
            },
            body: JSON.stringify({
            user: userMessage,
            bridge_id: bridgeId,
            thread_id: chatId ? chatId + "" : undefined,
            variables: variables
            }),
        }
    );
    return await response.json()
}

export const sendMessageTochannel = async (message) => {
    try {
      await fetch("https://flow.sokt.io/func/scri19UK6620",{
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

export const  ValidateAiResponse = (response ,schema, bridgeId, message_id,sendAlert,thread_id) => {
    const { error, value: validatedResponse } = schema.validate(response);
    if (error) {
       if(sendAlert === true){ 
          sendMessageTochannel({
          message: `"Validation error: " ${error.details[0].message}`,
          bridgeId:bridgeId,
          message_id:message_id,
          link : `https://ai.walkover.in/org/7488/bridges/history/${bridgeId}?thread_id=${thread_id}`,
          thread_id:thread_id,
      });
    }
      return { message: response.message };
    }
    return validatedResponse;
  }

export function nameToSlugName(name){
    return name.toLowerCase().replace(/[\s/()]+/g, '-');
}


export function safeParse(json,bridgeId,threadId){
  try {
    let data = JSON.parse(json);
    if(bridgeId === process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE){
      data =  ValidateAiResponse(data,updateBlogSchema,bridgeId,threadId,false);
    }else if(bridgeId == process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE){
      if(data.blog) data = ValidateAiResponse(data , createBlogSchema, bridgeId, threadId,false);
      else data = ValidateAiResponse(data, searchResultsSchema, bridgeId, threadId,false);
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

export const improveBlogPrompt = ( writer, philosopher, city, country ) => {
  return (`Rewrite the blog to be SEO-friendly, dynamic, and in a style resembling ${writer} —engaging and decision-focused, with humorous anecdotes, quotes, dialogue or cultural references. End in a tone akin to ${philosopher}. Mention one related blog in each section using markdown links if relevant. Use rhetorical questions, conversational tone, and colloquial language with slight regional flavour (${city}, ${country}). Format in Markdown for readability return output in JSON embedded within a Markdown :- { 'blog': '<same formate as given>'}`)  
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

export const writers = ["William Shakespeare", "Charles Dickens", "Jane Austen", "George Orwell", "Virginia Woolf", "James Joyce", "F. Scott Fitzgerald", "Mark Twain", "H.G. Wells", "Ernest Hemingway", "J.K. Rowling", "Emily Brontë", "T.S. Eliot", "Joseph Conrad", "Harper Lee", "Leo Tolstoy", "Gabriel García Márquez", "Oscar Wilde", "Toni Morrison", "Herman Melville"];

export const philosophers  = ["Socrates", "Plato", "Aristotle", "Immanuel Kant", "René Descartes", "Friedrich Nietzsche", "John Locke", "David Hume", "Jean-Jacques Rousseau", "Karl Marx", "Simone de Beauvoir", "Michel Foucault", "Bertrand Russell", "Ludwig Wittgenstein", "Baruch Spinoza", "Confucius", "Zhuangzi", "G.W.F. Hegel", "John Stuart Mill", "Søren Kierkegaard"];

export const countriesAndCities = [{ country: "United States", city: "New York" }, { country: "United States", city: "Los Angeles" }, { country: "United Kingdom", city: "London" }, { country: "United Kingdom", city: "Manchester" }, { country: "Canada", city: "Toronto" }, { country: "Canada", city: "Vancouver" }, { country: "France", city: "Paris" }, { country: "France", city: "Marseille" }, { country: "Germany", city: "Berlin" }, { country: "Germany", city: "Munich" }, { country: "Italy", city: "Rome" }, { country: "Italy", city: "Milan" }, { country: "Australia", city: "Sydney" }, { country: "Australia", city: "Melbourne" }, { country: "India", city: "Mumbai" }, { country: "India", city: "Delhi" }, { country: "Japan", city: "Tokyo" }, { country: "Japan", city: "Osaka" }, { country: "Brazil", city: "Rio de Janeiro" }, { country: "Brazil", city: "São Paulo" }];
