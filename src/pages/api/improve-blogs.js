import { askAi, ValidateAiResponse, sendMessageTochannel, sendAlert, improveBlogPrompt, extractJsonFromMarkdown } from "@/utils/utils";
import blogServices from "../../services/blogServices"
import { improveBlogSchema } from "@/utils/schema";
import {  getRandomAuthorByCountryAndType, insertManyAuthor } from "@/services/authorServices";


export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'POST':
            let results = {}; 
            let failedBlogs = [];  
            try {
                res.status(200).json({status:"success"})   // send immediate res 
                const blogs = await blogServices.getBlogsUpdatedNDaysAgo(1, environment);
                const bulkOperations = await createBulkOperation(blogs,environment);
                let validBulkOperations = [];
                bulkOperations.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        validBulkOperations.push(result.value);
                    } else if (result.status === 'rejected') {
                        failedBlogs.push({
                            id: blogs[index].id,
                            reason: result.reason.message
                        });
                    }
                });
                
                results = await blogServices.bulkUpdateBlogs(validBulkOperations, environment);
            } catch (error) {
                console.error("error in improve blogs", error)
                sendMessageTochannel({"message":'error in improve blog API.' , error : error.message})
             
            }finally{
                sendMessageTochannel({"message":`improveBlog complete ${results?.result?.nModified} blogs updated ` , failedBlogs : failedBlogs})
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

export async function distinctifyPhrase(processedBlog, environment) {
    if(processedBlog?.phrase){
        const existingBlogs = await blogServices.searchBlogsByQuery(processedBlog.phrase.content, environment);
        if(existingBlogs.length <= 5) return;
        console.log("Changing phrase Working...");
        const phraseSection = processedBlog.blog.find(section => section.section === processedBlog.phrase.section);
        const response = await askAi(process.env.DISTINCTIFY_PHRASE_BRIDGE, phraseSection.content, {phrase: processedBlog.phrase.content})
        phraseSection.content = response.response.data.content;
    }
}

export async function getNames (countryCode){
    try{
        let writer = await getRandomAuthorByCountryAndType(countryCode);
        if(!writer){
            writer = await getWriter(countryCode,'writer');
        }
        return  writer ;
    }catch(error){
        console.log("error in getting writer name",error);
        return { name : 'Arundhati Roy'}
    }
}
export async function getWriter(countryCode,type){
    const res = await askAi(process.env.NEXT_PUBLIC_WRITER_GENERATOR_BRIGDE,`countryCode:${countryCode} and type:${type}`,{ countryCode : countryCode , profession : type });
    const names = JSON.parse(res.response.data.content).data;
    await insertManyAuthor(names);
    return names[Math.floor(Math.random() * names.length)];
}


export async function createBulkOperation (blogs,environment){
   return await Promise.allSettled(blogs.map(async (blog) => {
         const imagePromise =  imageGenerator(blog.title,blog.meta?.SEOMetaDescription);
        const countryCode = blog.countryCode || 'IN'; 
        const author = await getNames(countryCode);
        let processedBlog = await improveBlog(blog.blog, author.name);
        // await distinctifyPhrase(processedBlog, environment);
        const imageUrl = await imagePromise;
        return {
            updateOne: {
                filter: { id: blog.id },
                update: { 
                  $set: { 
                    'blog': processedBlog,
                    'imageUrl': imageUrl
                  }
                }
              }
        };
    }));
}


async function imageGenerator (article_name, meta_description){
    const cinematographer_name = await getRandomAuthorByCountryAndType(null , 'Cinematographer').name;
    const imagePrompt = await askAi(process.env.IMAGE_PROMPT_GENERATOR_PROMPT,'',{cinematographer_name ,article_name, meta_description });
    const imageURL = await askAi(process.env.IMAGE_GENERATOR_BRIDGE,JSON.parse(imagePrompt.response.data.content).prompt);
    return imageURL.response.data.image_url;
}

export async function improveBlog(blog, author){
    let drIdx = 0;
    let [detailedReviews, dynamicSections] = blog.reduce((acc, section, idx) => {
        if (section.section === 'detailed_reviews') {
            drIdx = idx;
            acc[0] = section;
        }else{
            acc[1].push(section);
        }
        return acc;
    }, [null, []]);

    detailedReviews.content = await Promise.all(detailedReviews.content.map(async (appReview) => {
        const content = JSON.parse( await askAi(
                process.env.DETAILED_REVIEW_IMPROVE, 
                appReview.content
            )
            .then(res => res.response.data.content)
        ).content
        appReview.content = content;
        return appReview;
    }))

    let newDynamicSections = await askAi(
        process.env.IMPROVE_BRIDGE,
        `${JSON.stringify({blog : dynamicSections })}`, { writer : author }
    );

    const messageId = newDynamicSections.response.data.message_id;

    newDynamicSections = extractJsonFromMarkdown(newDynamicSections.response.data.content).blog;
    
    const newBlog = [];

    for(let i = 0;i < newDynamicSections.length;i++){
        if(i === drIdx){
            newBlog.push(detailedReviews);
        }
        newBlog.push(newDynamicSections[i]);
    }
    let processedBlog = ValidateAiResponse(newBlog, improveBlogSchema);
    if(processedBlog.success === true){
        processedBlog = processedBlog.value;
    } else {
        sendAlert(processedBlog.errorMessages, process.env.IMPROVE_BRIDGE, messageId, "" );
        console.error(processedBlog.errorMessages);
        throw new Error("Invalid Response from AI");
    }

    return processedBlog;
}