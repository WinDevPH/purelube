import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const OFFICE: L.LatLngExpression = [51.3462, 12.0192]

export default function OfficeMap() {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const map = L.map(el, {
      center: OFFICE,
      zoom: 15,
      minZoom: 13,
      maxZoom: 18,
      scrollWheelZoom: false,
      attributionControl: false,
      zoomControl: false,
      dragging: true,
    })
    mapRef.current = map

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
    }).addTo(map)

    const pin = L.divIcon({
      className: 'purelube-map-pin',
      iconSize: [36, 46],
      iconAnchor: [18, 46],
      html: `<span class="purelube-pin">
        <span class="purelube-pin-pulse"></span>
        <svg viewBox="0 0 28 36" width="28" height="36" aria-hidden="true">
          <path d="M14 35s12-11.2 12-21A12 12 0 1 0 2 14c0 9.8 12 21 12 21z" fill="#ee1c2e"/>
          <circle cx="14" cy="14" r="5" fill="#fff"/>
        </svg>
      </span>`,
    })

    L.marker(OFFICE, { icon: pin, keyboard: false }).addTo(map)
    setReady(true)

    const onResize = () => map.invalidateSize()
    window.setTimeout(onResize, 200)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      map.remove()
      mapRef.current = null
      setReady(false)
    }
  }, [])

  return (
    <>
      <div ref={ref} className="purelube-map absolute inset-0 h-full w-full" />
      {ready && (
        <div className="absolute right-3 top-3 z-[800] flex flex-col overflow-hidden clip-diag-4 border border-white/15 bg-ink/90 shadow-[0_8px_20px_rgba(0,0,0,0.25)] sm:right-4 sm:top-4">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => mapRef.current?.zoomIn()}
            className="grid h-8 w-8 place-items-center text-[18px] font-medium leading-none text-white transition-colors hover:bg-brand"
          >
            +
          </button>
          <span className="h-px w-full bg-white/15" />
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => mapRef.current?.zoomOut()}
            className="grid h-8 w-8 place-items-center text-[20px] font-medium leading-none text-white transition-colors hover:bg-brand"
          >
            −
          </button>
        </div>
      )}
    </>
  )
}
