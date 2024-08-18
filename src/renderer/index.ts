import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs/promises'
import Logger from '../utils/logger'

export async function saveHtmlScreenshot(htmlString: string): Promise<string> {
  Logger().info(`Received HTML. Attempting to Generate Image`)
  return new Promise<string>(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      await page.setContent(htmlString)

      // Ensure the .images directory exists
      const imagesDir = path.join(process.cwd(), '.images')
      await fs.mkdir(imagesDir, { recursive: true })

      // Generate a unique filename
      const filename = `screenshot-${Date.now()}.png`
      const filePath = path.join(imagesDir, filename)

      // Take and save the screenshot
      await page.screenshot({ path: filePath, fullPage: true })

      await browser.close()
      Logger().info('Image Generated Successfully')
      return resolve(`images/${filename}`)
    } catch (e) {
      Logger().error('Error when generating Image', JSON.stringify(e, null, 2))
      return reject(e)
    }
  })
}
