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
    what_to_cover: Joi.string().required()
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
          Joi.object({
            appName: Joi.string().required(),
            what_to_cover: Joi.string().required()
          })
        )
      ).required(),
      section: Joi.string().optional(),
    })
  ).required(),
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
    blog: Joi.array().items(Joi.object()).required(),
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
      heading: Joi.string().required(),
      section: Joi.string().optional(),
    })
  ).required(),
  title: Joi.string().required()
});