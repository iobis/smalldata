export function scrollToRef(ref) {
  if (ref && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function scrollToStartRef(ref) {
  if (ref && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
