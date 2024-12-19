
export default async function handler(req, res) {
  try {
    return res.status(200).json({
      status: 'ok',
      message: 'Server is healthy'
    })
  } catch (error) {
    console.log("healthcheck failed",error)
    return res.status(400).json({
      status: 'error',
      message: 'server is not healthy',
      errorMesssage : error.message,
    })
  }
}
