// services/blogService.js
// Ensures the route is run on the experimental-edge Runtimeimport blogService from '@/services/blogServices';

import createBlogModel from '../../models/BlogModel';
import dbConnect from '../../lib/mongoDb';
import { generateNanoid } from '@/utils/utils';
import { getUpdatedApps } from './integrationServices';

const withBlogModel = async (environment, callback) => {
  const client = await dbConnect(environment);
  const Blog = createBlogModel(client);
  return callback(Blog);
};

const getAllBlogs = (userId,environment) => {
  console.time("getAllBlogs");
  return withBlogModel(environment, (Blog) => {
    return Blog.aggregate([
      {
        $addFields: {
          isUserBlog: { $cond: { if: { $eq: ["$createdBy", parseInt(userId)] }, then: 1, else: 0 } }
        }
      },
      {
        $sort: { isUserBlog: -1 }
      },
      {
       $project: { isUserBlog: 0 } 
      }
    ]).limit(20)
  });
};

const createBlog = async (blogData, environment) => {
  return await withBlogModel(environment, async (Blog) => {
    const apps = await getUpdatedApps(blogData, environment);
    const newBlog = (await Blog.create({ ...blogData, apps, id: generateNanoid(6) })).toObject();
    return {
      id: newBlog.id,
      blog: newBlog.blog, 
      apps: newBlog.apps, 
      tags: newBlog.tags, 
      title: newBlog.title
    }
  });
};

const getBlogById = (blogId, environment) => {
  console.time("getBlogId");
  return withBlogModel(environment,  async (Blog) => {
    console.timeEnd("getBlogId");
    return JSON.parse(JSON.stringify( await Blog.findOne({ "id": blogId })));
  });
};

const updateBlogById = (blogId, blogData, userId, environment) => {
  return withBlogModel(environment, async (Blog) => {
    const apps = await getUpdatedApps(blogData, environment);
    const updateData = {
      ...blogData,
      updatedAt: Date.now(),
      apps,
      $addToSet: { createdBy: userId },
    };

    return Blog.findOneAndUpdate(
      { "id": blogId },
      updateData,
      { new: true } 
    ).lean();

  });
};

const getUserBlogs = (userId, environment) => {
  return withBlogModel(environment, (Blog) => {
    return Blog.find({
      'createdBy': userId,
      'blog': { $exists: true },
      'id': { $exists: true }
    });
  });
};

const getOtherBlogs = (userId, environment) => {
  return withBlogModel(environment, (Blog) => {
    return Blog.find({
      'createdBy': { $ne: userId },
      'blog': { $exists: true },
      'id': { $exists: true },
      'apps': { $exists: true, $ne: [] }
    }).limit(20);
  });
};

const searchBlogsByQuery = (query, environment) => {
  return withBlogModel(environment, (Blog) => {
    return Blog.find({
      'blog.content': { $regex: query, $options: 'i' }
    },
    { apps: 1, tags: 1, title: 1, id: 1});
  });
};

const searchBlogsByTag = (tag, environment) => {
  return withBlogModel(environment, (Blog) => {
    return Blog.find({
      'tags': {
        $regex: tag,
        $options: 'i'
      } 
    },
    { apps: 1, tags: 1, title: 1, id: 1}
    )
  });
};

const searchBlogsByTags = async (tagList , id ,category ,environment) => {
  return withBlogModel(environment, (Blog) => {
    const results = Blog.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { 'meta.category': { $regex: new RegExp(`^${category}$`, 'i') } },
                { tags: { $in: tagList.map(tag => new RegExp(`^${tag}$`, 'i')) } }, 
              ]
            },
            { id: { $ne: id } }
          ]
        }
      },
      {
        $addFields: {
          matchedTagsCount: {
            $size: {
              $filter: {
                input: "$tags",
                as: "tag",
                cond: {
                  $in: [
                    { $toLower: "$$tag" }, 
                    tagList.map(tag => tag.toLowerCase()) 
                  ] 
                }
              }
            }
          },
          categoryMatch: { $cond: { if: { $regexMatch: { input: "$meta.category", regex: new RegExp(`^${category}$`, 'i') } }, then: 1, else: 0 } }
        }
      },
      {
        $sort: { categoryMatch: -1, matchedTagsCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          apps: 1, title: 1, id: 1
      }}
    ]);

    return results;
  });
};

const getAllBlogTags = async (environment) => {
  return withBlogModel(environment,(Blog)=>{
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight (start of the day)
    return  Blog.find(
      {
        $or: [
          { createdAt: { $gt: today } },  // Condition for 'createdAt'
          { updatedAt: { $gt: today } }   // Condition for 'updatedAt'
        ]
      },
      { _id: 1, tags: 1 }  // Projection to only return '_id' and 'tags'
    );
  })
  
}

const updateBlogsTags = async (blogsTagsToUpdate,environment) => {
  return withBlogModel(environment,async (Blog) => {
    try {
      const bulkOperations = Object.keys(blogsTagsToUpdate).map(blogId => ({
        updateOne: {
          filter: { _id: blogId },  // Match document by _id
          update: { $set: { tags : Array.from(blogsTagsToUpdate[blogId]) } },  // Update the 'tags' field
        }
      }));

      const result = await Blog.bulkWrite(bulkOperations);
     return result;
    } catch (error) {
      console.error("Error performing bulk update:", error);
    }
  })
}
const searchBlogsByUserId = async ( userId, environment ) => {
  return withBlogModel(environment, (Blog)=>{
    return Blog.find({ createdBy: parseInt(userId) })
  })
}

const getLastHourBlogs = async (environment) => {
  return withBlogModel(environment, async (Blog) => {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1); 

    const blogs = await Blog.find({
      createdAt: { $gte: oneHourAgo } 
    });

    return blogs;
  });
};

const bulkUpdateBlogs = async (bulkOperations, environment) => {
  return withBlogModel(environment, async (Blog) => {
      const result = await Blog.bulkWrite(bulkOperations);
      return result;
  });
};

const blogWithApps = async (apps, environment) => {
  return withBlogModel(environment, async (Blog) => {
    return await Blog.find({
      $and: apps.map(appName => ({[`apps.${appName}`] : {$exists: true}}))
    }, 
    {_id : 0, id: 1, title: 1, apps: 1, tags: 1})
  })
}

export default { getAllBlogs, createBlog, getBlogById, updateBlogById, getUserBlogs, getOtherBlogs, searchBlogsByQuery, searchBlogsByTags, getAllBlogTags,updateBlogsTags,searchBlogsByTag, getLastHourBlogs, bulkUpdateBlogs , searchBlogsByUserId, blogWithApps };
