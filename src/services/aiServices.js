import { askAi } from '@/utils/utils';

export async function titleSuggestions(userQuery){
    try{
        const data = await askAi('66f11ea00beb22b878f9c73b', userQuery);
        const suggestions = JSON.parse(data.response.data.content).suggestions;
        return suggestions;
    }catch(err){
        console.log(err);
        return [];
    }
}

