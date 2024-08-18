import express from 'express'
import { saveHtmlScreenshot } from './renderer'
import getLogger from './utils/logger'

const app = express()
const port = 5646

app.use(express.json())
app.post('/api/v1/render', async (req, res) => {
  try {
    const { html } = req.body
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' })
    }
    const screenshotPath = await saveHtmlScreenshot(html)
    res.json({
      message: 'Screenshot saved successfully',
      path: screenshotPath,
    })
    getLogger().info('Screenshot saved successfully')
  } catch (error) {
    getLogger().error('Error:', error)
    res.status(500).json({ error: 'An error occurred while processing the request' })
  }
})
app.use('/images', express.static('.images'))
app.listen(port, () => {
  getLogger().info(`Server running at http://localhost:${port}`)
})
