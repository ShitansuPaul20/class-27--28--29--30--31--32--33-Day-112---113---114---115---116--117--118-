import React from 'react'
import AppRoutes from './AppRoutes'
import "./features/shared/style/global.scss"
import { AuthProvider } from './features/Auth/auth.context'

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
      
  )
}

export default App