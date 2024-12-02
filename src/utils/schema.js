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
  blogStructure: Joi.array().items(Joi.object({
    heading: Joi.string().required(), 
    what_to_cover: Joi.string().required()
  })).required()
});

export const createdBlogSchema = Joi.object({
  title: Joi.string().required(),
  blog: Joi.array().items(
    Joi.object({
      heading: Joi.string().required(),
      content: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(
          Joi.object({
            appName: Joi.string().required(),
            content: Joi.string().required()
          })
        )
      ).optional(),
      what_to_cover: Joi.string().optional(),
    })
  ).required()
  .custom((value, helpers) => {
    if (!Array.isArray(value) || value.length === 0) {
      return helpers.message('Blog array cannot be empty');
    }

    if (!Array.isArray(value[1]?.content)) {
      return helpers.message('The content of the second blog entry (blog[1]) must be an array containing the app names and there details');
    }
    
    return value;
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
    blog: Joi.array().items(Joi.object()).required() .custom((value, helpers) => {
      if (!Array.isArray(value) || value.length === 0) {
        return helpers.message('Blog array cannot be empty');
      }
  
      if (!Array.isArray(value[1]?.content)) {
        return helpers.message('The content of the second blog entry (blog[1]) must be an array containing the app names and there details');
      }
      
      return value;
    }),
    meta: Joi.object().optional(),
  }).optional().allow(null),
  shouldCreate: Joi.string().valid("Yes", "No").insensitive().optional(),
  urls: Joi.array().items(urlSchema).optional().allow(null),
});


export const improveBlogSchema = Joi.object({
  phrase: Joi.object({
    content: Joi.string().required(),
    section: Joi.string().required(),
  }).optional(),
  blog: Joi.array().items(
    Joi.object({
      content: Joi.any().required(),
      heading: Joi.string().required()  
    })
  ).required(),
  title: Joi.string().required()
});