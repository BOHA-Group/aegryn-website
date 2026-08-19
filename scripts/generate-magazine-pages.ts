/**
 * generate-magazine-pages.ts
 *
 * Converts public/reports/aegryn-report-2026.pdf into individual JPG images
 * for the MagazineViewer flipbook.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-magazine-pages.ts
 *   — or —
 *   npm run magazine:generate
 *
 * Prerequisites: Ghostscript must be installed on the host machine.
 *   macOS: brew install ghostscript
 *   Ubuntu: apt-get install ghostscript
 *
 * Output: public/reports/2026/pages/page.XXXX.jpg (150 DPI, 1240×1754 px)
 */

import { fromPath }  from 'pdf2pic'
import path           from 'path'
import fs             from 'fs'

const INPUT_PDF  = path.resolve('public/reports/aegryn-report-2026.pdf')
const OUTPUT_DIR = path.resolve('public/reports/2026/pages')
const DPI        = 150
const WIDTH      = 1240
const HEIGHT     = 1754

async function run(): Promise<void> {
  if (!fs.existsSync(INPUT_PDF)) {
    console.error('❌  PDF not found:', INPUT_PDF)
    console.info('    Place aegryn-report-2026.pdf in public/reports/ then retry.')
    process.exit(1)
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const convert = fromPath(INPUT_PDF, {
    density:      DPI,
    saveFilename: 'page',
    savePath:     OUTPUT_DIR,
    format:       'jpg',
    width:        WIDTH,
    height:       HEIGHT,
  })

  console.log('🔄  Converting PDF → JPG images …')

  const results = await convert.bulk(-1, { responseType: 'buffer' })

  console.log(`✅  Generated ${results.length} pages`)
  console.log(`    Output: ${OUTPUT_DIR}`)
  console.log('    Next: npm run dev → /intelligence/report/2027')
}

run().catch((err: unknown) => {
  console.error('❌  Conversion failed:', err)
  process.exit(1)
})
