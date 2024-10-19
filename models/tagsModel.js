// models/Blog.js
import mongoose from 'mongoose';
const TagSchema = new mongoose.Schema({
  tags: Array
},{ minimize: false });

console.log( mongoose.models.Tags)
export default  mongoose.models.Tags || mongoose.model('Tags', TagSchema);