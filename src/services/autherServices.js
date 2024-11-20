// services/blogService.js
// Ensures the route is run on the experimental-edge Runtimeimport blogService from '@/services/blogServices';
import createAuthorModel from '../../models/AuthorModel';
import dbConnect from '../../lib/mongoDb';

export const createAuther = async (data) => {
  const client = await dbConnect('prod');
  const Author = createAuthorModel(client);
  const author = await Author.create(data);
  return author;
}

export const getRandomAuthorByCountryAndType = async ( countryCode, profession) => {
  const client = await dbConnect('prod');
  const Author = await createAuthorModel(client);

  try {
    const randomAuthor = await Author.aggregate([
      { $match: { countryCode: countryCode, profession: profession } },  
      { $sample: { size: 1 } }  
    ]);

    return randomAuthor[0];  
  } catch (error) {
    console.error("Error fetching random author:", error);
    throw error;
  }
};

export const insertManyAuther = async (data) => {
  const client = await dbConnect('prod');
  const Author = createAuthorModel(client);
  const author = await Author.insertMany(data);
  return author;
}