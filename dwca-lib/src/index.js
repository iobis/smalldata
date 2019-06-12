import * as hooks from './hooks/hooks'
import { AuthContext, AuthProvider } from './context/AuthContext'

function log(name) {
  console.log('log:', name)
}

export {
  AuthContext,
  AuthProvider,
  hooks,
  log
}
