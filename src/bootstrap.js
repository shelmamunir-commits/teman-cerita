const root = document.getElementById('root')
let startupFailed = false

function errorMessage(reason) {
  if (reason instanceof Error) return reason.message
  if (typeof reason === 'string') return reason
  return 'Terjadi error JavaScript yang tidak diketahui.'
}

function showStartupError(reason) {
  if (startupFailed) return

  // Do not replace an application that has already rendered successfully.
  queueMicrotask(() => {
    if (startupFailed || root?.childElementCount > 0) return
    startupFailed = true

    const panel = document.createElement('main')
    panel.setAttribute('role', 'alert')
    panel.style.cssText = 'max-width:680px;margin:64px auto;padding:24px;font:14px/1.6 system-ui,sans-serif;color:#334155'

    const title = document.createElement('h1')
    title.textContent = 'Aplikasi belum berhasil dimuat'
    title.style.cssText = 'margin:0 0 10px;font-size:22px;color:#0f172a'

    const help = document.createElement('p')
    help.textContent = 'Salin pesan di bawah ini agar penyebabnya dapat diperbaiki:'

    const detail = document.createElement('pre')
    detail.textContent = errorMessage(reason)
    detail.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;padding:14px;border-radius:10px;background:#f1f5f9;color:#b91c1c'

    panel.append(title, help, detail)
    root?.replaceChildren(panel)
  })
}

window.addEventListener('error', (event) => showStartupError(event.error || event.message))
window.addEventListener('unhandledrejection', (event) => showStartupError(event.reason))

import('./main.jsx').catch(showStartupError)
