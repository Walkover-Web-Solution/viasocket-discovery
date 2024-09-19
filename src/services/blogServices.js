// services/blogService.js
 // Ensures the route is run on the experimental-edge Runtimeimport blogService from '@/services/blogServices';

import Blog from '../../models/BlogModel';
import dbConnect from '../../lib/mongoDb';

const getAllBlogs = async () => {
  await dbConnect();
  return Blog.find({});
};

const createBlog = async (blogData) => {
  await dbConnect();
  return Blog.create(blogData);
};

const getBlogById = async(blogId) => {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Blog.findById(blogId)));
}

const updateBlogById = async(blogId,blogData) => {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Blog.findByIdAndUpdate(blogId,blogData)));
}

const getUserBlogs = async (userId) => {
  await dbConnect();
  return await Blog.find({
    'createdBy': userId ,
    'blog': { $exists: true} // Ensure markdown is not an empty string
  });
}

const getOtherBlogs = async (userId) => {
  await dbConnect();
  return await Blog.find({
    'createdBy': { $ne: userId },
    'blog': { $exists: true} 
  });
}
export default { getAllBlogs, createBlog, getBlogById, updateBlogById , getUserBlogs, getOtherBlogs};
