import puppeteer from 'puppeteer-core'
const [,, name='home', scrollTo='0', w='1440', h='900', theme='dark', locale='en'] = process.argv
const out = 'C:/Users/hp/AppData/Local/Temp/claude/S--Protofolie/d71a257b-5c8c-4899-b44d-692aa0788a17/scratchpad/shots'
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', e => errors.push(String(e)))
page.on('console', m => { if (m.type()==='error') errors.push(m.text()) })
await page.evaluateOnNewDocument((t, l) => { localStorage.setItem('theme', t); localStorage.setItem('locale', l) }, theme, locale)
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 2500))
if (scrollTo !== '0') {
  await page.evaluate((s) => { const el = document.getElementById(s); window.scrollTo({ top: el ? el.offsetTop - 40 : +s, behavior: 'instant' }) }, scrollTo)
  await new Promise(r => setTimeout(r, 3500))
}
await page.screenshot({ path: `${out}/${name}.png` })
console.log('saved', name, 'errors:', errors.length ? errors : 'none')
await browser.close()
