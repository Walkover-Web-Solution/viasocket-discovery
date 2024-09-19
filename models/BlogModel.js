// models/Blog.js
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: String,
  blog: Object,
  tags: Array, 
  apps: Array,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: Number
});

export default mongoose.models?.Blog || mongoose.model('Blog', BlogSchema);
