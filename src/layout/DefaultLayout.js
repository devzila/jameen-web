import React from 'react'
import { AppContent, AppSidebar, AppHeader } from '../components/index'
import { AuthContext } from '../contexts/AuthContext'

const DefaultLayout = () => {
  const token = '1234'
  return (
    <AuthContext.Provider value={token}>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  )
}

export default DefaultLayout
