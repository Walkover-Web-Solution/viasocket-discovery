// models/Blog.js
import mongoose from 'mongoose';
const createTagModel = (connection) => {
  if(connection.models.Tags) { return connection.models.Tags; }
  const TagSchema = new mongoose.Schema({
    tags: Array,
    categories :Array,
    parameters :Array
  }, { minimize: false });
  return   connection.model('Tags', TagSchema);
}

export default createTagModel;