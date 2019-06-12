import { useOnClickOutside, useDebounce } from './hooks/hooks'
import { AuthContext, AuthProvider } from './context/AuthContext'

function log(name) {
  console.log('log:', name)
}

export {
  AuthContext,
  AuthProvider,
  useOnClickOutside,
  useDebounce,
  log
}
