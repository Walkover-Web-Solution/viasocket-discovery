// services/blogService.js
// Ensures the route is run on the experimental-edge Runtimeimport blogService from '@/services/blogServices';

import Blog from '../../models/BlogModel';
import dbConnect from '../../lib/mongoDb';
import { generateNanoid } from '@/utils/utils';
import {  getUpdatedApps } from './integrationServices';

const getAllBlogs = async () => {
  console.time("getAllBlogs");
  await dbConnect();
  console.timeEnd("getAllBlogs");
  return Blog.find({});
};

const createBlog = async (blogData) => {
  await dbConnect();
  const apps = await getUpdatedApps(blogData)
  return Blog.create({ ...blogData, apps, id: generateNanoid(6) });
};

const getBlogById = async (blogId) => {
  console.time("getBlogId");
  await dbConnect();
  console.timeEnd("getBlogId");
  return JSON.parse(JSON.stringify(await Blog.findOne({ "id": blogId })));
}

const updateBlogById = async (blogId, blogData) => {
  await dbConnect();
  const apps = await getUpdatedApps(blogData)
  return JSON.parse(JSON.stringify(await Blog.findOneAndUpdate({ "id": blogId }, {...blogData,updatedAt:Date.now() ,apps})));
}

const getUserBlogs = async (userId) => {
  await dbConnect();
  return await Blog.find({
    'createdBy': userId,
    'blog': { $exists: true },// Ensure markdown is not an empty string
    'id': { $exists: true }
  });
}

const getOtherBlogs = async (userId) => {
  await dbConnect();
  return await Blog.find({
    'createdBy': { $ne: userId },
    'blog': { $exists: true },
    'id': { $exists: true },
    'apps': { $exists: true, $ne: [] }
  }).limit(20);
}

const searchBlogsByQuery = async (query) => {
  await dbConnect();
  return Blog.find({
    'blog.content': { $regex: query, $options: 'i' }
  });
};

const searchBlogsByTag = async (tag) => {
  await dbConnect();
  return Blog.find(
    {
      'tags' : `${tag}`
    }
  )
}

const searchBlogsByTags = async (tagList , id ) => {
  await dbConnect();
    const results = await Blog.aggregate([
      {
        $match: {
          tags: { $in: tagList },
          id: { $ne: id }
        }
      },
      {
        $addFields: {
          matchedTagsCount: {
            $size: {
              $filter: {
                input: "$tags",
                as: "tag",
                cond: { $in: ["$$tag", tagList] }
              }
            }
          }
        }
      },
      {
        $sort: { matchedTagsCount: -1 }
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
 
};

const getAllBlogTags = async () => {
  await dbConnect();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight (start of the day)
  return await Blog.find(
    {
      $or: [
        { createdAt: { $gt: today } },  // Condition for 'createdAt'
        { updatedAt: { $gt: today } }   // Condition for 'updatedAt'
      ]
    },
    { _id: 1, tags: 1 }  // Projection to only return '_id' and 'tags'
  );
}

const updateBlogsTags = async (blogsTagsToUpdate) => {
  await dbConnect();
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
}

export default { getAllBlogs, createBlog, getBlogById, updateBlogById, getUserBlogs, getOtherBlogs, searchBlogsByQuery, searchBlogsByTags, getAllBlogTags,updateBlogsTags };
