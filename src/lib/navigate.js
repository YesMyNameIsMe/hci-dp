import { useEffect } from 'react'

// Hash router helper: navigate('/subscriptions/spotify') -> #/subscriptions/spotify
export const navigate = (path) => {
  window.location.hash = path
}

// Redirect away from a screen that can't render (unknown id, flow not completed, ...)
export function useRedirectIf(condition, path) {
  useEffect(() => {
    if (condition) navigate(path)
  }, [condition, path])
}
