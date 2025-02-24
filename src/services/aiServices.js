import { askAi } from '@/utils/utils';

export async function titleSuggestions(userQuery, existingTitles){
    try{
        let variables;
        if(existingTitles?.length){
            variables = {
                existingMessage: `These articles are already existed, so please don't suggest similar articles: ${existingTitles.join(' \n ')}`,
            }
        }
        const data = await askAi('66f11ea00beb22b878f9c73b', userQuery, variables);
        const suggestions = JSON.parse(data.response.data.content).suggestions;
        return suggestions;
    }catch(err){
        console.error(err);
        return [];
    }
}

