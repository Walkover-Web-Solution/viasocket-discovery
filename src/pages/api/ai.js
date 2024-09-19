function handler(req, res) {
  const dummyData = [
    { id: 1, title: 'Post One', body: 'This is the first post' },
    { id: 2, title: 'Post Two', body: 'This is the second post' },
    { id: 3, title: 'Post Three', body: 'This is the third post' },
  ];

  res.status(200).json(dummyData);
}

export default async function getMarkdownData(req, res) {
  try{
    const userPrompt = req.body.prompt;
    // const response = axios.get('')
  }catch(error){
    console.error(error);
    res.status(500).json({message: 'Some Error Occured: ' + error, data : error.stack});
  }
  
}