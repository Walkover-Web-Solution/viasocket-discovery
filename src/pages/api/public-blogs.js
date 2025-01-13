import blogServices from "@/services/blogServices"

export default async function handler(req, res) {
    try {
      const blogs = await blogServices.getBlogsBeforeNDays(7);
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
  