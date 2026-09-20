import { useState } from 'react'
import { MapPin, Loader2, Navigation } from 'lucide-react'
import { cn } from '../../lib/cn.js'

const TYPES = [
  { id: 'Puskesmas', label: 'Puskesmas' },
  { id: 'Layanan kesehatan jiwa', label: 'Kesehatan Jiwa' },
]

export default function NearbyMap() {
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | denied | unsupported
  const [type, setType] = useState(TYPES[0].id)

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('ready')
      },
      () => setStatus('denied'),
      { timeout: 10000, enableHighAccuracy: false },
    )
  }

  const q = encodeURIComponent(type)
  const src = coords
    ? `https://www.google.com/maps?q=${q}&ll=${coords.lat},${coords.lng}&z=14&output=embed`
    : `https://www.google.com/maps?q=${q}&output=embed`

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={cn(
                'rounded-full px-4 py-1.5 text-[12.5px] font-bold transition',
                type === t.id
                  ? 'bg-brand text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {status !== 'ready' && status !== 'loading' && (
          <button
            onClick={locate}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand-deep dark:text-brand"
          >
            <Navigation size={14} /> Gunakan lokasiku
          </button>
        )}
      </div>

      {status === 'loading' && (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
          <Loader2 size={18} className="animate-spin" /> Mencari lokasimu…
        </div>
      )}

      {status === 'idle' && (
        <div className="text-[12.5px] text-slate-500 dark:text-slate-400 py-3 flex items-start gap-2">
          <MapPin size={15} className="mt-0.5 shrink-0 text-brand" />
          <span>Peta menampilkan hasil umum. Gunakan lokasimu hanya jika ingin mencari layanan yang lebih dekat.</span>
        </div>
      )}

      {(status === 'denied' || status === 'unsupported') && (
        <div className="text-[12.5px] text-slate-500 dark:text-slate-400 py-3 flex items-start gap-2">
          <MapPin size={15} className="mt-0.5 shrink-0 text-brand" />
          <span>
            {status === 'denied'
              ? 'Lokasi nggak diizinkan. Peta menampilkan hasil umum — izinkan lokasi untuk hasil terdekat.'
              : 'Browser kamu nggak mendukung lokasi. Peta menampilkan hasil umum.'}
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <iframe
          title={`Peta ${type} terdekat`}
          src={src}
          className="w-full h-64"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  )
}
