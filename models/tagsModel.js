// models/Blog.js
import mongoose from 'mongoose';
const createTagModel = (connection) => {
  const TagSchema = new mongoose.Schema({
    tags: Array,
    categories :Array,
    parameters :Array
  }, { minimize: false });
  return connection.models.Tags || connection.model('Tags', TagSchema);
}

export default createTagModel;