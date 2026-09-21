import { useEffect } from 'react'

const PROTECTED = new Set(['IMG', 'CANVAS', 'VIDEO', 'PICTURE', 'SVG'])

/**
 * Deterrents against casual asset downloading:
 * - blocks the right-click context menu on images / canvas / video
 * - blocks native image dragging (drag-to-desktop)
 * - blocks Ctrl/Cmd+S and Ctrl/Cmd+U
 *
 * Note: nothing served to a browser can be made truly un-downloadable; this only
 * removes the easy paths (right-click → Save, drag-out, save page).
 */
export default function useAssetProtection() {
  useEffect(() => {
    const isProtected = (t: EventTarget | null) =>
      t instanceof Element && (PROTECTED.has(t.tagName.toUpperCase()) || !!t.closest('canvas, picture, video'))

    const onContextMenu = (e: MouseEvent) => {
      if (isProtected(e.target)) e.preventDefault()
    }
    const onDragStart = (e: DragEvent) => {
      if (isProtected(e.target)) e.preventDefault()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) e.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])
}
