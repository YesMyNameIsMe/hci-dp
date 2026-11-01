import { useSyncExternalStore } from 'react'

//reads current page from the URL hash
function subscribe(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

const getPath = () => window.location.hash.slice(1) || '/'

export function useRoute() {
  return useSyncExternalStore(subscribe, getPath)
}
