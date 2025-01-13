import blogServices from "@/services/blogServices"

export default async function handler(req, res) {
    const environment = req.headers['env'];
    try {
      const blogs = await blogServices.getBlogsBeforeNDays(7, environment);
      return res.status(200).json({
        message: 'success',
        data: blogs
      })
    } catch (error) {
      return res.status(400).json({
        message: 'error: ' + error,
      })
    }
  }
  