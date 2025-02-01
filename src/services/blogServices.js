// services/blogService.js
// Ensures the route is run on the experimental-edge Runtimeimport blogService from '@/services/blogServices';

import createBlogModel from '../../models/BlogModel';
import dbConnect from '../../lib/mongoDb';
import { generateNanoid, getAppNames, nameToSlugName, restoreceDotsInArray, restoreDotsInKeys } from '@/utils/utils';
import { getUpdatedApps } from './integrationServices';
import stopWords from '@/utils/stopWords';

const withBlogModel = async (environment, callback) => {
  const client = await dbConnect(environment);
  const Blog = createBlogModel(client);
  return callback(Blog);
};

const getAllBlogs = (userId, environment) => {
  return withBlogModel(environment, async(Blog) => {
    let blogs = await Blog.aggregate([
      {
        $addFields: {
          isUserBlog: { $cond: { if: { $eq: ["$createdBy", parseInt(userId)] }, then: 1, else: 0 } }
        }
      },
      {
        $sort: { isUserBlog: -1 }
      },
      {
        $project: { 
          apps: 1,
          tags: 1,
          title: 1,
          id: 1,
          slugName: 1,
          meta: 1,
         }
      }
    ]).limit(20)
    blogs = blogs.map((blog)=>{
      blog.apps = restoreDotsInKeys(blog.apps);
      return blog;
    })
    return blogs;
  });
};

const createBlog = async (blogData, environment) => {
  return await withBlogModel(environment, async (Blog) => {
    const appNames = getAppNames(blogData.blog)
    const apps = await getUpdatedApps(appNames, environment);
    const newBlog = (await Blog.create({ 
      ...blogData,
      apps,
      id: generateNanoid(6),
      toImprove : true 
    })).toObject();
    return {
      id: newBlog.id,
      blog: newBlog.blog, 
      apps: apps, 
      tags: newBlog.tags, 
      title: newBlog.title,
      titleDescription : newBlog.titleDescription
    }
  });
};

const getBlogById = (blogId, environment) => {
  console.time("getBlogId");
  return withBlogModel(environment, async (Blog) => {
    console.timeEnd("getBlogId");
    return JSON.parse(JSON.stringify(await Blog.findOne({ "id": blogId })));
  });
};

const updateBlogById = (blogId, blogData, userIds, environment) => {
  return withBlogModel(environment, async (Blog) => {
    const appNames = getAppNames(blogData.blog);
    const apps = await getUpdatedApps(appNames, environment);
    
    const updateData = {
      ...blogData,
      updatedAt: Date.now(),
      apps,
    };
    const userIdsArray = Array.isArray(userIds) ? userIds : [userIds];


    const updateResult = await Blog.findOneAndUpdate(
      { "id": blogId },
      { $set: updateData },
      { new: true } 
    ).lean();

    if (updateResult) {
      await Blog.findOneAndUpdate(
        { "id": blogId },
        { $addToSet: { createdBy: { $each: userIdsArray } } },
        { new: true }
      ).lean();
    }

    return updateResult;
  });
};

// const getUserBlogs = (userId, environment) => {
//   return withBlogModel(environment, (Blog) => {
//     return Blog.find({
//       'createdBy': userId,
//       'blog': { $exists: true },
//       'id': { $exists: true }
//     });
//   });
// };

// const getOtherBlogs = (userId, environment) => {
//   return withBlogModel(environment, (Blog) => {
//     return Blog.find({
//       'createdBy': { $ne: userId },
//       'blog': { $exists: true },
//       'id': { $exists: true },
//       'apps': { $exists: true, $ne: [] }
//     }).limit(20);
//   });
// };

const searchBlogsByQuery = (query, environment) => {
  return withBlogModel(environment, (Blog) => {
  const formattedQuery = query.split(' ').filter(word => !stopWords.has(word.toLowerCase())).map(word => `"${word}"`).join(' ');
    return Blog.find({
      '$text': { '$search': formattedQuery },
    }, { apps: 1, tags: 1, title: 1, id: 1, slugName: 1, meta: 1 });  
  
    // return Blog.find({
    //   $or: [
    //     { title: { $regex: query, $options: 'i' } },
    //     // { slugName: { $regex: query, $options: 'i' } },
    //     // { 'blog.content': { $regex: query, $options: 'i' } },
    //     { tags: { $regex: query, $options: 'i' } },  
    //     { meta : { $regex: query, $options: 'i' } }, 

    //   ]
    // },
    //   { apps: 1, tags: 1, title: 1, id: 1, slugName:1, meta:1 });

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
      { apps: 1, tags: 1, title: 1, id: 1,slugName:1, meta:1  }
    )
  });
};

const searchBlogsByTags = async (tagList , id ,category ,environment) => {
  return withBlogModel(environment, async(Blog) => {
    let results = await Blog.aggregate([
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
          apps: 1, title: 1, id: 1, tags: 1, meta:1 , slugName:1
      }}
    ]);
    results = results.map((blog)=>{
      blog.apps = restoreDotsInKeys(blog.apps);
      return blog;
    })
    return JSON.parse(JSON.stringify(results));
  });
};

const getAllBlogTags = async (environment) => {
  return withBlogModel(environment, (Blog) => {
    const today = new Date();
const last24Hours = new Date(today);
last24Hours.setHours(today.getHours() - 24, 0, 0, 0); 
    
    return Blog.find(
      {
        $or: [
          { createdAt: { $gt: last24Hours } },  // Condition for 'createdAt'
          { updatedAt: { $gt: last24Hours } }   // Condition for 'updatedAt'
        ]
      },
      { _id: 1, tags: 1, meta: 1, title : 1 }  // Projection to only return '_id' and 'tags'
    );
  })

}

const updateBlogsTags = async (blogsTagsToUpdate, environment) => {
  return withBlogModel(environment, async (Blog) => {
    try {
      const bulkOperations = (Object.keys(blogsTagsToUpdate)).map(blogId => ({
        updateOne: {
          filter: { _id: blogId },  // Match document by _id
          update: {
            $set:
            {
              meta: blogsTagsToUpdate[blogId].meta,
              tags: Array.from(blogsTagsToUpdate[blogId].tags)
            }
          },  // Update the 'tags' field
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
    return Blog.find({ createdBy: parseInt(userId) },
    {
      apps: 1,
      tags: 1,
      title: 1,
      id: 1,
      slugName: 1,
      meta: 1,
      createdBy:1
    }).sort({ createdAt: -1 });
  })
}

const getBlogsUpdatedNDaysAgo = async (n, environment) => {
  return withBlogModel(environment, async (Blog) => {
    const nDaysAgo = new Date();
    nDaysAgo.setDate(nDaysAgo.getDate() - n); 

    const blogs = await Blog.find({
      $or: [
        { createdAt: { $gte: nDaysAgo } },  
        { updatedAt: { $gte: nDaysAgo } } 
      ]
    });

    return blogs;
  });
}

const getImprovedBlogs = async (improved, environment) => {
  return withBlogModel(environment, async (Blog) => {
    const blogs = await Blog.find({
      toImprove: improved
    });

    return blogs;
  });
}

const getBlogsBeforeNDays = async (n, environment) => {
  return withBlogModel(environment, async (Blog) => {
    const nDaysAgo = new Date();
    nDaysAgo.setDate(nDaysAgo.getDate() - n); 

    const blogs = await Blog.find({
      $or: [
        { createdAt: { $lte: nDaysAgo } },  
      ], 
    }, {id: 1, title: 1, slugName: 1, meta: 1, updatedAt: 1, _id : 0});

    return blogs;
  });
}

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

const searchBlogsByApps = (appNames, blogId, environment) => {
  const apps = appNames?.map((appName) => restoreceDotsInArray(appName));
  return withBlogModel(environment, async (Blog) => {
    let blogs = await Blog.aggregate([
      {
        $match: {
          id: { $ne: blogId }, 
          $or: apps.map(appName => ({
            [`apps.${appName}`]: { $exists: true } 
          }))
        }
      },
      {
        $facet: appNames.reduce((facet, appName) => {
          facet[appName] = [
            { $match: { [`apps.${appName}`]: { $exists: true } } }, 
            { $limit: 4 }, 
            { $project: { title: 1, id: 1, slugName:1, meta:1 } }  
          ];
          return facet;
        }, {})
      }
    ]);
    blogs = blogs.map(blogFacet => {
      const restoredFacet = restoreDotsInKeys(blogFacet);
      return restoredFacet;
    });
    return JSON.parse(JSON.stringify(blogs));
  });
};

const getPopularUsers = (environment) => {
  return withBlogModel(environment, async (Blog) => {
    const popularUsers = await Blog.aggregate([
      {
        $facet: {
          // Count blogs created by each user (createdBy[0])
          createdCounts: [
            {
              $group: {
                _id: { $arrayElemAt: ["$createdBy", 0] }, // First user is the creator
                createdBlogs: { $sum: 1 } // Count occurrences
              }
            }
          ],
          // Count blogs contributed by each user (createdBy[1 to n])
          contributedCounts: [
            { $unwind: { path: "$createdBy", includeArrayIndex: "index" } }, // Unwind while keeping index
            { $match: { index: { $gt: 0 } } }, // Only contributors (index > 0)
            {
              $group: {
                _id: "$createdBy", // Group by contributor ID
                contributedBlogs: { $sum: 1 } // Count occurrences
              }
            }
          ]
        }
      },
      {
        $project: {
          users: {
            $concatArrays: ["$createdCounts", "$contributedCounts"] // Merge both result sets
          }
        }
      },
      { $unwind: "$users" }, // Unwind merged array
      {
        $group: {
          _id: "$users._id", // Group by user ID
          createdBlogs: { $sum: { $ifNull: ["$users.createdBlogs", 0] } }, // Sum created count
          contributedBlogs: { $sum: { $ifNull: ["$users.contributedBlogs", 0] } } // Sum contributed count
        }
      },
      { $sort: { createdBlogs: -1, contributedBlogs: -1 } }, // Sort by created first, then contributed
      { $limit: 6 } // Get top 6 users
    ]);
    return popularUsers;
  });
};







const createComment = async (blogId, commentData, environment) => {
  try{
    return withBlogModel(environment, async(Blog) => {
      const commentId = generateNanoid(5);
      const comment = {
        text: commentData.text,
        createdBy: commentData.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: commentData.status || 'pending',
      };
  
      await Blog.updateOne(
        { id: blogId },
        { $set: { 
          [`comments.${commentId}`]: comment,
          toUpdate: true,
         }
        }
      );
  
      return { commentId, ...comment };
    });
  }catch(err){
    console.error("Errror fghj", err);
  }
};

const getAllComments = async (blogId, environment) => {
  return withBlogModel(environment, async(Blog) => {
    const blog = await Blog.findOne({ id: blogId });

    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog.comments;
  });
};

const getCommentById = async (blogId, commentId, environment) => {
  return withBlogModel(environment, async(Blog) => {
    const blog = await Blog.findOne({ id: blogId });

    if (!blog || !blog.comments.has(commentId)) {
      throw new Error("Comment not found");
    }

    return blog.comments[commentId];
  });
};

const updateComment = async (blogId, commentId, commentData, environment) => {
  return withBlogModel(environment, async(Blog) => {
    const updateData = {
      "text": commentData.text,
      "status": commentData.status,
      "updatedAt": new Date(),
    };

    await Blog.updateOne(
      { id: blogId },
      { $set: { [`comments.${commentId}`]: updateData } }
    );

    return updateData;
  });
};

const deleteComment = async (blogId, commentId, userId, environment) => {
  return withBlogModel(environment, async(Blog) => {
    const blog = await Blog.findOne({ id: blogId });

    if (!blog) {
      throw new Error("Blog not found");
    }
   
    const comment = blog.comments[commentId];

    if (!comment) {
      throw new Error("Comment not found");
    }
    if(comment.createdBy != userId){
      throw new Error("You are not authorized to delete this comment");
    }
    let toUpdate = false;
    Object.entries(blog.comments).forEach(([key, comment]) => {
      if (key != commentId && comment.status == 'pending') {
        toUpdate = true;
      } 
    });
    

    return await Blog.updateOne(
      { id: blogId },
      { 
        $unset: { [`comments.${commentId}`]: "" },
        $set : { toUpdate: toUpdate }
      },
    )
  });
};

const getBlogsToMergeComments = (environment) =>{
  return withBlogModel(environment, async(Blog) => {
    const data = await Blog.find(
     {toUpdate : true},
     { id : 1 }
    );
    return data;
  });
}

export default {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlogById,
  searchBlogsByQuery,
  searchBlogsByTags,
  getAllBlogTags,
  updateBlogsTags,
  searchBlogsByTag,
  bulkUpdateBlogs,
  searchBlogsByUserId,
  blogWithApps,
  searchBlogsByApps,
  getPopularUsers,
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment, 
  getBlogsBeforeNDays, 
  getBlogsUpdatedNDaysAgo,
  getBlogsToMergeComments,
  getImprovedBlogs
};


