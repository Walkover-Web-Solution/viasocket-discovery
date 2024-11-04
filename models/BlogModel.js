// models/Blog.js
import mongoose from 'mongoose';
const createBlogModel = (connection) => {
  const BlogSchema = new mongoose.Schema({
    id: {
      type: String,
      unique: true,
    },
    title: String,
    slugName: {
      type: String,
      default: function () {
        return this.title ? this.title.replace(/\s+/g, '-').toLowerCase() : ''; 
      },
    },
    blog: Object,
    tags: Array,
    apps: Object,
    meta: Object, 
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt :{
    type: Date,
    default: Date.now,
  },
  createdBy: Array,
  }, { minimize: false });

  BlogSchema.index({ id: 1 });

  return connection.models.Blog || connection.model('Blog', BlogSchema);
};

export default createBlogModel;
