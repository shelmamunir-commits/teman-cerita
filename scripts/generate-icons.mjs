// Menghasilkan ikon PWA persegi (192 & 512) dari public/icon.jpeg.
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'

const jpeg = readFileSync(new URL('../public/icon.jpeg', import.meta.url)).toString('base64')

for (const size of [192, 512]) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#ffffff"/>
      <image href="data:image/jpeg;base64,${jpeg}" x="0" y="0" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>
    </svg>`
  const resvg = new Resvg(svg)
  const png = resvg.render().asPng()
  const out = new URL(`../public/icon-${size}.png`, import.meta.url)
  writeFileSync(out, png)
  console.log('generated', out.pathname, png.length, 'bytes')
}
