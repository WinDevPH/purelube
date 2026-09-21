import { createContext, useContext, type RefObject } from 'react'

type ScrollRoot = RefObject<HTMLElement | null> | { current: null }

/** Ref to Lenis scroll root. `null` = window scroll. */
export const ScrollContext = createContext<ScrollRoot>({ current: null })

export function useScrollContainer() {
  return useContext(ScrollContext)
}
