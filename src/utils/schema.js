import Joi from "joi";

const urlSchema = Joi.object({
  title: Joi.string().required(),
  apps: Joi.object().optional(),
  id: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
})

export const createBlogSchema = Joi.object({
  message: Joi.string().required(),
  blog: Joi.object({
    blogData: Joi.array().items(Joi.object()).required(),
    tags: Joi.array().items(Joi.string()).required(),
    meta: Joi.object().optional(),
  }).required(),
  urls: Joi.array().items(urlSchema).optional(),
});

export const searchResultsSchema = Joi.object({
  message: Joi.string().required(),
  urls: Joi.array().items(urlSchema).optional(),
});

export const updateBlogSchema = Joi.object({
  message: Joi.string().required(),
  blog: Joi.object({
    title: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    blog: Joi.array().items(Joi.object()).required(),
    meta: Joi.object().optional(),
  }).optional(),
  shouldCreate: Joi.string().valid("Yes", "No").insensitive().optional(),
  urls: Joi.array().items(urlSchema).optional(),
});


export const improveBlogSchema = Joi.object({
  phrase: Joi.object({
    content: Joi.string().required(),
    section: Joi.string().required(),
  }).optional(),
  blog: Joi.array().items(
    Joi.object({
      section: Joi.string().required(),
      content: Joi.any().required(),
      heading: Joi.string().optional()  
    })
  ).required(),
});