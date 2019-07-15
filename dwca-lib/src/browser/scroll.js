export function scrollToRef(ref) {
  if (ref && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
