// models/Blog.js
import mongoose from 'mongoose';
const BlogSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: String,
  slugName: {
    type:String,
    default: function () {
      return this.title ? this.title.replace(/\s+/g, '-').toLowerCase() : ''; 
    }
  },
  blog: Object,
  tags: Array,
  apps: Object,
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
