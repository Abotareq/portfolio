import puppeteer from 'puppeteer-core'
const [,, name='home', scrollTo='0', w='1440', h='900', theme='dark', locale='en'] = process.argv
const out = 'C:/Users/hp/AppData/Local/Temp/claude/S--Protofolie/d71a257b-5c8c-4899-b44d-692aa0788a17/scratchpad/shots'
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', e => errors.push(String(e)))
page.on('console', m => { if (m.type()==='error') errors.push(m.text()) })
const view = process.argv[8] || 'galaxy'
await page.evaluateOnNewDocument((t, l, v) => { localStorage.setItem('theme', t); localStorage.setItem('locale', l); localStorage.setItem('view', v) }, theme, locale, view)
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 2500))
if (scrollTo !== '0') {
  await page.evaluate((s) => {
    const el = document.getElementById(s)
    if (el) return window.scrollTo({ top: el.offsetTop - 40, behavior: 'instant' })
    // galaxy: section index → drei ScrollControls container
    const sc = [...document.querySelectorAll('div')].find((d) => d.style.overflowY === 'auto' && d.style.position === 'absolute')
    if (sc) sc.scrollTo({ top: (+s / 6) * (sc.scrollHeight - sc.clientHeight), behavior: 'instant' })
  }, scrollTo)
  await new Promise(r => setTimeout(r, 9000))
}
await page.screenshot({ path: `${out}/${name}.png` })
console.log('saved', name, 'errors:', errors.length ? errors : 'none')
await browser.close()
