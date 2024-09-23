// models/Blog.js
import mongoose from 'mongoose';
import { generateNanoid } from '@/utils/utils';
const BlogSchema = new mongoose.Schema({
  id: {
    type: String,
    default: generateNanoid(6),
    unique: true,
  },
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
BlogSchema.index({ id: 1 })

export default mongoose.models?.Blog || mongoose.model('Blog', BlogSchema);
