// services/blogService.js
// Ensures the route is run on the experimental-edge Runtimeimport blogService from '@/services/blogServices';

import Blog from '../../models/BlogModel';
import dbConnect from '../../lib/mongoDb';
import { generateNanoid } from '@/utils/utils';

const getAllBlogs = async () => {
  await dbConnect();
  return Blog.find({});
};

const createBlog = async (blogData) => {
  await dbConnect();
  const defaultIconUrl = "https://example.com/default-icon.png";
  const apps = blogData?.blog?.find(section => section.section === 'summaryList')?.content?.reduce((acc, app) => {
    acc[app.name] = { iconUrl: app.iconUrl || defaultIconUrl };
    return acc;
  }, {});
  return Blog.create({ ...blogData, apps, id: generateNanoid(6) });
};

const getBlogById = async (blogId) => {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Blog.findOne({ "id": blogId })));
}

const updateBlogById = async (blogId, blogData) => {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Blog.findOneAndUpdate({ "id": blogId }, blogData)));
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
  return Blog.find({
    'blog.content': { $regex: query, $options: 'i' },
    status: "published"
  });
};
export default { getAllBlogs, createBlog, getBlogById, updateBlogById, getUserBlogs, getOtherBlogs, searchBlogsByQuery };
