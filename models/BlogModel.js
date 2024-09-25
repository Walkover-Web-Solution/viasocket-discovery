// models/Blog.js
import mongoose from 'mongoose';
const BlogSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: String,
  blog: Object,
  tags: Array,
  apps: Array,
  status: {
    type: String,
    default: "draft"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: Number
});
BlogSchema.index({ id: 1 })

export default mongoose.models?.Blog || mongoose.model('Blog', BlogSchema);
