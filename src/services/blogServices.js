// services/blogService.js
// Ensures the route is run on the experimental-edge Runtimeimport blogService from '@/services/blogServices';

import Blog from '../../models/BlogModel';
import dbConnect from '../../lib/mongoDb';
import { generateNanoid } from '@/utils/utils';
import { getUpdatedApps } from './integrationServices';

const getAllBlogs = async (userId) => {
  console.time("getAllBlogs");
  await dbConnect();
  console.timeEnd("getAllBlogs");
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
  return JSON.parse(JSON.stringify(await Blog.findOneAndUpdate({ "id": blogId }, { ...blogData, apps })));
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
  return Blog.find(
    { 'blog.content': { $regex: query, $options: 'i' } }, 
    { apps: 1, tags: 1, title: 1, id: 1}
  )
};

const searchBlogsByTag = async (tag) => {
  await dbConnect();
  return Blog.find({
    'tags': {
      $regex: tag,
      $options: 'i'
    } 
  },
  { apps: 1, tags: 1, title: 1, id: 1}
  )
}

const searchBlogsByTags = async (tagList, id) => {
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
      }
    }
  ]);

  return results;

};
export default { getAllBlogs, createBlog, getBlogById, updateBlogById, getUserBlogs, getOtherBlogs, searchBlogsByQuery, searchBlogsByTags, searchBlogsByTag };
