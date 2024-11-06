import { customAlphabet } from 'nanoid';
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

export function nameToSlugName(name){
    return name.toLowerCase().replace(/[\s/()]+/g, '-');
}

export const formateTitle = (title) => {
    return title?.toLowerCase().replace(/\s+/g, '-');
};