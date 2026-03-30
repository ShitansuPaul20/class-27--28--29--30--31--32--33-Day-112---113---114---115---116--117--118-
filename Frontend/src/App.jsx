import React from 'react'
import AppRoutes from './AppRoutes'
import FloatingCanvas from './features/shared/components/FloatingCanvas'
import "./features/shared/style/global.scss"
import { AuthProvider } from './features/Auth/auth.context'
import { SongContextProvider } from './features/Home/song.context'

const App = () => {
  return (
    <>
      <FloatingCanvas count={32} minSize={16} maxSize={22} minSpeed={0.3} maxSpeed={0.6} minOpacity={0.1} maxOpacity={0.3} />
      <AuthProvider>
        <SongContextProvider>
          <AppRoutes/>
        </SongContextProvider>
      </AuthProvider>
    </>
  )
}

export default App