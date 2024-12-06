// models/Blog.js
import mongoose from 'mongoose';
import {  replaceDotsInKeys, restoreDotsInKeys } from '@/utils/utils';
const createBlogModel = (connection) => {
  if (connection.models.Blog) {
    return connection.models.Blog;
  }
  const BlogSchema = new mongoose.Schema({
    id: {
      type: String,
      unique: true,
    },
    title: String,
    titleDescription : String,
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
    countryCode: {
      type: String,
      required: true,
    },
    updatedAt :{
    type: Date,
    default: Date.now,
  },
  createdBy: Array,
  }, { minimize: false });

  BlogSchema.pre('save', function (next) {
    if (this.apps) {
      this.apps = replaceDotsInKeys(this.apps);
    }
    next();
  });

  BlogSchema.pre('find', function (next) {
    const query = this.getQuery();
    if (query && query.$and) {
        query.$and = query.$and.map(condition => {
          Object.keys(condition).forEach((key) => {
            if (key.startsWith("apps.")) {
                const newKey = `apps.${key.slice(5).replace(/\./g, '~')}`;  // check the case where we want to access the properties of 'apps' 
                const data = condition[key];
                delete condition[key];
                condition[newKey] = data;
            }
        });
        return condition;
        });
    }
    next();
});

  
  BlogSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update && update.apps) {
      update.apps = replaceDotsInKeys(update.apps);
    }
    next();
  });
  
  BlogSchema.post('find', function(docs) {
    if (Array.isArray(docs)) {
      docs.forEach(doc => {
        if (doc.apps) {
          doc.apps = restoreDotsInKeys(doc.apps);
        }
      });
    }
  });

  BlogSchema.index({ id: 1 });

  return connection.model('Blog', BlogSchema);
};

export default createBlogModel;
