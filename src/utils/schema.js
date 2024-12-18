import Joi from "joi";

const urlSchema = Joi.object({
  title: Joi.string().required(),
  apps: Joi.object().optional(),
  id: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
})

export const blueprintSchema = Joi.object({
  metadata: Joi.object().required(), 
  title: Joi.string().required(),
  title_description : Joi.string().optional(),
  blogStructure: Joi.array().items(Joi.object({
    heading: Joi.string().required(), 
    what_to_cover: Joi.string().required(),
    section : Joi.string().optional(),
  })).required()
});

export const createdBlogSchema = Joi.object({
  title: Joi.string().required(),
  title_description : Joi.string().optional(),
  blog: Joi.array().items(
    Joi.object({
      heading: Joi.string().required(),
      what_to_cover: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(
          Joi.alternatives().try(
            Joi.object({
              appName: Joi.string().required(),
              what_to_cover: Joi.string().required()
            }),
            Joi.object({
              question: Joi.string().required(),
              answer: Joi.string().required()
            })
          )
        )
        
      ).required(),
      section: Joi.string().optional(),
    })
  ).required()
  .custom((blogs, helpers) => {
    let hasDetailedReview = false;

    for (let blog of blogs) {
      if (blog.section === 'detailed_reviews') {
        hasDetailedReview = true;
        
        const isArrayOfObjects = Array.isArray(blog.what_to_cover) &&
          blog.what_to_cover.every(item => typeof item === 'object' && item.appName && item.what_to_cover);
        
        if (!isArrayOfObjects) {
          return helpers.message('When the key "section" is "detailed_reviews", the key "what_to_cover" must be an array of objects. Each object must contain two keys: "appName" (a string representing the name of the app) and "what_to_cover" (a string describing the content or feature of the app).');
        }
      }else if(blog.section === 'FAQ') {
        const isArrayOfObjects = Array.isArray(blog.what_to_cover) &&
          blog.what_to_cover.every(item => typeof item === 'object' && item.question && item.answer);
        
        if (!isArrayOfObjects) {
          return helpers.message('When the key "section" is "FAQ", the key "what_to_cover" must be an array of objects. Each object must contain two keys: "question" (a string representing the question) and "answer" (a string describing the answer of the question).');
        }
      }else{
        if(typeof blog.what_to_cover !== 'string') return helpers.message('what_to_cover in sections other than "detailed_reviews" and "FAQ" must be a string.');
      }
    }
    if (!hasDetailedReview) {
      return helpers.message('The blog array must contain an element where the key "section" is "detailed_reviews", the key "heading" is a string (e.g., "some heading"), and the key "what_to_cover" is an array of objects. Each object in the "what_to_cover" array must contain the key "appName" (a string representing the app name) and the key "what_to_cover" (a string describing the app).');
    }

    return blogs;
  }),
  tags: Joi.array().items(Joi.string()).required()
});

export const searchResultsSchema = Joi.object({
  message: Joi.string().required(),
  existingBlogs: Joi.array().items(Joi.object({
      id: Joi.string().required()
    }).pattern(/^((?!id).)*$/, Joi.any()).optional()
  ).allow(null),
  shouldCreate: Joi.boolean().optional()
});

export const updateBlogSchema = Joi.object({
  message: Joi.string().required(),
  blog: Joi.object({
    title: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    blog: Joi.array().items(Joi.object()).required().custom((blogs, helpers) => {
      let hasDetailedReview = false;
  
      for (let blog of blogs) {
        if (blog.section === 'detailed_reviews') {
          hasDetailedReview = true;
          
          const isArrayOfObjects = Array.isArray(blog.content) &&
            blog.content.every(item => typeof item === 'object' && item.appName && item.content);
          
          if (!isArrayOfObjects) {
            return helpers.message('When the key "section" is "detailed_reviews", the key "content" must be an array of objects. Each object in the array must contain two specific keys: "appName" and "content". The "appName" key should be a string representing the name of the app, and the "content" key should be a string that describes the app or its features.');
          }
        }else if (blog.section === 'FAQ'){
          const isArrayOfObjects = Array.isArray(blog.content) &&
          blog.content.every(item => typeof item === 'object' && item.question && item.answer);
        
          if (!isArrayOfObjects) {
            return helpers.message('When the key "section" is "FAQ", the key "content" must be an array of objects. Each object must contain two keys: "question" (a string representing the question) and "answer" (a string describing the answer of the question).');
          }
        }else{
            if(typeof blog.content !== 'string') return helpers.message('Content in sections other than "detailed_reviews" must be a string.');
        }
      }
  
      if (!hasDetailedReview) {
        return helpers.message('Blog array must have at least one element where the key "section" is "detailed_reviews", the key "heading" is a string, and the key "content" is an array of objects, where each object has the key "appName" (a string) and the key "content" (a string describing the app).');
      }
  
      return blogs;
    }),
    meta: Joi.object().optional(),
  }).optional().allow(null),
  shouldCreate: Joi.string().valid("Yes", "No").insensitive().optional(),
  urls: Joi.array().items(urlSchema).optional().allow(null),
});


// export const improveBlogSchema = Joi.array().items(
//     Joi.object({
//       content: Joi.any().required(),
//       heading: Joi.string().required(),
//       section: Joi.string().optional(),
//     })
// );