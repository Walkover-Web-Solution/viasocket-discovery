import blogServices from "@/services/blogServices";
import { blogSchema } from "@/utils/schema";
const _ = require("lodash");
import { askAi, extractJsonFromMarkdown, ValidateAiResponse } from "@/utils/utils";

export default async function handler(req, res) {
  const { method } = req;
  const { blogId } = req.query;
  const environment = req.headers["env"];

  switch (method) {
    case "GET":
      try {
        await updateBlogUsingComments(blogId, environment);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true });
    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

export const updateBlogUsingComments = async (blogId, environment) => {

  let blog = await blogServices.getBlogById(blogId, environment);
  const usefulBlog = {
    blog: blog.blog, 
    tags: blog.tags, 
    meta: blog.meta, 
  }
  const commentsArray = Object.entries(blog.comments).filter(comment => comment[1].status === 'pending').map(comment => ({message: comment[1].text, id : comment[0]}));
  //make crux of comments array
  const crux = JSON.parse(await askAi(
    process.env.CRUX_GENERATOR,
    "comments: " + JSON.stringify(commentsArray),
    {
      blog: usefulBlog,
    }
  ).then(res => res.response.data.content));
  

  //make updateOperations using crux of comments
  const updatedOperations = await askAi(
    process.env.UPDATE_OPERATION_GENERATOR,
    crux.action || "No changes",
    {
      blog: usefulBlog,
    }
  );

  const operations = JSON.parse(
    updatedOperations.response.data.content
  ).operations || [];
  
  // operations.forEach(async(operation,index)=>{
  //   if(operation.operation === 'add_app'){
  //     const content = JSON.parse( await askAi(
  //       process.env.DETAILED_REVIEW_IMPROVE,
  //       operation.data.content,
  //       )
  //       .then(res => res.response.data.content)
  //     ).content
  //     operations[index].data.content = content;
  //   }else if(operation.operation === 'update'){
  //     const content = JSON.parse( await askAi(
  //       process.env.IMPROVE_BRIDGE,
  //       operation.data.content,
  //       )
  //       .then(res => res.response.data.content)
  //     ).blog
  //     operations[index].data.content = content;
  //   }
  // })

  const updateOperations = async () => {
    for (const [index, operation] of Object.entries(operations)) {
      if (operation.operation === "add_app") {
        const content = JSON.parse(
          await askAi(
            process.env.DETAILED_REVIEW_IMPROVE,
            operation.data.content,
            {
              meta: blog.meta,
            }
          ).then((res) => res.response.data.content)
        ).content;

        operations[index].data.content = content;
      } else if (operation.operation === "update") {   /// what about add-content
        const content = extractJsonFromMarkdown(
          await askAi(process.env.IMPROVE_BRIDGE, operation.data.content).then(
            (res) => res.response.data.content
          )
        ).blog;
        operations[index].data.content = content;
      }
    }
  };

  await updateOperations();

  //apply operations to blog  and update comments status  to approved  and return updated blog
  blog = applyOperations(operations, blog);
  blog.toUpdate = false;
  let userIds = crux.applicableComments.map(id => blog.comments[id].createdBy);
  commentsArray.forEach((comment) => {
    blog.comments[comment.id].status = "approved";
  });
  
  const validate = ValidateAiResponse(blog,blogSchema);
  if(validate.success == false){
    throw new Error(`the updated blog doesn't pass the validation -- ${validate.errorMessages}`);
  }

  //finaly update the update according to all the changes
  const newBlog = await blogServices.updateBlogById(
    blogId,
    blog,
    userIds,
    environment
  );
  return newBlog;
};

function applyOperations(operations, blog) {
  const updatedBlog = blog;
  operations.forEach((operation) => {
    const { data, operation: type } = operation;

    switch (type) {
      case "add_content":
        const newSection = {
          heading: data.heading,
          content: data.content,
        };
        updatedBlog.blog.splice(data.position, 0, newSection);
        break;

      case "remove_content":
        if (updatedBlog.blog[data.position].section !== "detailed_reviews") {
          updatedBlog.blog.splice(data.position, 1);
        } else {
          throw Error("cannot remove detailed_reviews section at position");
        }
        break;

      case "add_app":
        const detailedReviews = updatedBlog.blog.find(
          (section) => section.section === "detailed_reviews"
        );
        if (detailedReviews) {
          detailedReviews.content.splice(data.position, 0, {
            appName: data.appName,
            content: data.content,
          });
        }
        break;

      case "remove_app":
        const detailedReviewsSection = updatedBlog.blog.find(
          (section) => section.section === "detailed_reviews"
        );
        if (detailedReviewsSection) {
          detailedReviewsSection.content.splice(data.position, 1);
        }
        break;

      case "update":
        _.set(updatedBlog, data.path, data.content);
        break;

      case "reorder":
        const reorderTarget = updatedBlog.blog.find(
          (section) => section.section === "detailed_reviews"
        ).content;
        if (Array.isArray(reorderTarget)) {
          const reorderedArray = [];

          data.order.forEach((index) => {
            if (index >= 0 && index < reorderTarget.length) {
              reorderedArray.push(reorderTarget[index]);
            } else {
              console.error(`Invalid index ${index} in the order array.`);
            }
          });

          reorderTarget.length = 0;
          reorderTarget.push(...reorderedArray);
        } else {
          throw Error(
            `Path ${data.path} does not point to an array for reorder.`
          );
        }
        break;
      default:
        console.error(`Unsupported operation: ${type}`);
    }
  });

  return updatedBlog;
}
