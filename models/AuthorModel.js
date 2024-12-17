import mongoose from 'mongoose';

const createAuthorModel = (connection) => {
  if(connection.models.Author) return connection.models.Author;
  const authorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
      default: 'writer'
    },
  });

  return  connection.model('Author', authorSchema);
}

export default createAuthorModel;
